const Account = require("../models/accountModel");
const Transaction = require("../models/Transaction");
const LedgerEntry = require("../models/LedgerEntry");
const mongoose = require("mongoose");

// Money Helpers: integer paise <-> decimal rupees
const toPaise = (rupees) => {
  const num = Number(rupees);
  if (isNaN(num) || num <= 0) return null;
  return Math.round(num * 100);
};

const toRupees = (paise) => {
  return (paise || 0) / 100;
};

//@desc   >>>> Create Account
//@route  >>>> POST /api/account/create
//@Access >>>> Private (through admin approve only)
const createAccount = async (req, res, next) => {
  try {
    const initialPaise = toPaise(req.body.balance) || 0;
    const account = await Account.create({
      client_id: req.body.id,
      balance: initialPaise,
    });

    // If initial deposit > 0, record initial transaction and double-entry ledger legs
    if (initialPaise > 0) {
      const txnRef = `DEP-INIT-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const txn = await Transaction.create({
        transactionReference: txnRef,
        type: "DEPOSIT",
        amount: initialPaise,
        receiverAccountId: account.id.toString(),
        receiverClientId: account.client_id,
        status: "COMPLETED",
        balanceAfter: initialPaise,
        description: "Initial Account Deposit",
      });

      const debitLegId = `LED-${Date.now()}-DR-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const creditLegId = `LED-${Date.now()}-CR-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      await LedgerEntry.create([
        {
          ledgerId: debitLegId,
          transactionId: txn._id,
          transactionReference: txnRef,
          accountId: "SYSTEM_GATEWAY_CLEARING",
          entryType: "DEBIT",
          amount: initialPaise,
          balanceAfter: null,
          description: `Clearing debit for initial account balance on ${account.id}`,
        },
        {
          ledgerId: creditLegId,
          transactionId: txn._id,
          transactionReference: txnRef,
          accountId: account.id.toString(),
          entryType: "CREDIT",
          amount: initialPaise,
          balanceAfter: initialPaise,
          description: "Initial Account Opening balance credit",
        },
      ]);
    }

    // go to notification
    req.approved = {
      request_id: req.body.request_id,
      client_id: account.client_id,
      account_id: account.id,
    };
    next();
  } catch (error) {
    if (error.message.match(/(Balance|Account|id)/gi)) {
      return res.status(400).send(error.message);
    }
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Get account (with IDOR check & on-demand transaction history synthesis)
//@route  >>>> GET /api/account/:id
//@Access >>>> private(User / Admin)
const getAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).send("Account Not Found!");
    }

    // IDOR check: Verify account belongs to authenticated user or caller is admin
    if (req.user && account.client_id !== req.user.id.toString() && req.user.role !== "admin") {
      return res.status(403).send("Forbidden: Access denied to other user's account");
    }

    // Query transaction history to dynamically synthesize in/out/deposit/withdraw logs
    // Single source of truth: Transaction & LedgerEntry collections (zero unbounded duplicate storage in Accounts)
    const txns = await Transaction.find({
      $or: [
        { senderAccountId: account.id.toString() },
        { receiverAccountId: account.id.toString() },
      ],
      status: "COMPLETED",
    }).sort({ createdAt: -1 });

    const inLogs = [];
    const outLogs = [];
    const depLogs = [];
    const wthLogs = [];

    for (const t of txns) {
      const amt = toRupees(t.amount);
      if (t.type === "TRANSFER") {
        if (t.receiverAccountId === account.id.toString()) {
          inLogs.push({
            _id: t._id,
            from: t.senderAccountId,
            balance_transfered: amt,
            createdAt: t.createdAt,
          });
        }
        if (t.senderAccountId === account.id.toString()) {
          outLogs.push({
            _id: t._id,
            to: t.receiverAccountId,
            balance_transfered: amt,
            createdAt: t.createdAt,
          });
        }
      } else if (t.type === "DEPOSIT") {
        depLogs.push({
          _id: t._id,
          depositted_amount: amt,
          createdAt: t.createdAt,
        });
      } else if (t.type === "WITHDRAW") {
        wthLogs.push({
          _id: t._id,
          withdrawed_amount: amt,
          createdAt: t.createdAt,
        });
      }
    }

    const accountObj = account.toObject();
    accountObj.balancePaise = account.balance;
    accountObj.balance = toRupees(account.balance);
    accountObj.in = inLogs;
    accountObj.out = outLogs;
    accountObj.deposit_logs = depLogs;
    accountObj.withdraw_logs = wthLogs;

    return res.status(200).json(accountObj);
  } catch (error) {
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Delete Account (with IDOR ownership check)
//@route  >>>> DELETE /api/account/:id
//@Access >>>> private(for user / admin)
const deleteAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).send("Account Not Found!");
    }

    // IDOR ownership check
    if (req.user && account.client_id !== req.user.id.toString() && req.user.role !== "admin") {
      return res.status(403).send("Forbidden: You do not have permission to delete this account");
    }

    const deletedAccount = await Account.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: deletedAccount.id });
  } catch (error) {
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Transfer Money (Pure MongoDB ACID Session + Double-Entry Ledger + Idempotency)
//@route  >>>> PUT /api/account/transfer/:from_id/:to_id
//@Access >>>> private(for User only)
const transfer = async (req, res, next) => {
  const amountInPaise = toPaise(req.body.balanceTransfered);
  if (!amountInPaise || amountInPaise <= 0) {
    return res.status(400).send("Invalid transfer amount. Must be greater than 0");
  }

  const fromId = req.params.from_id;
  const toId = req.params.to_id;

  if (fromId === toId) {
    return res.status(400).send("Sender and receiver accounts cannot be the same");
  }

  // Idempotency: Check if already processed
  const idempotencyKey = req.headers["idempotency-key"] || req.body.idempotencyKey;
  if (idempotencyKey) {
    const existingTx = await Transaction.findOne({ idempotencyKey });
    if (existingTx && existingTx.status === "COMPLETED") {
      const sendingAcc = await Account.findById(fromId);
      const receivingAcc = await Account.findById(toId);
      req.transfered = {
        updatedSendingAccount: {
          ...sendingAcc.toObject(),
          balance: toRupees(sendingAcc.balance),
        },
        updatedReceivingAccount: {
          ...receivingAcc.toObject(),
          balance: toRupees(receivingAcc.balance),
        },
        balanceTransfered: toRupees(existingTx.amount),
        transactionReference: existingTx.transactionReference,
      };
      return next();
    }
  }

  try {
    const sendingAccount = await Account.findById(fromId);
    if (!sendingAccount) {
      return res.status(404).send("Sender account not found");
    }

    // IDOR / Ownership validation
    if (req.user && sendingAccount.client_id !== req.user.id.toString() && req.user.role !== "admin") {
      return res.status(403).send("Forbidden: You do not have authorization to transfer from this account");
    }

    const receivingAccount = await Account.findById(toId);
    if (!receivingAccount) {
      return res.status(404).send("Beneficiary account not found");
    }

    if (sendingAccount.balance < amountInPaise) {
      return res.status(400).send("Insufficient account balance for this transfer");
    }

    const executeTransfer = async (session) => {
      const opts = session ? { session, new: true } : { new: true };
      const createOpts = session ? { session } : {};

      const updatedSending = await Account.findOneAndUpdate(
        { _id: fromId, balance: { $gte: amountInPaise } },
        { $inc: { balance: -amountInPaise } },
        opts
      );

      if (!updatedSending) {
        throw new Error("INSUFFICIENT_FUNDS");
      }

      const updatedReceiving = await Account.findByIdAndUpdate(
        toId,
        { $inc: { balance: amountInPaise } },
        opts
      );

      if (!updatedReceiving) {
        throw new Error("RECEIVER_NOT_FOUND");
      }

      const txnRef = `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const [txn] = await Transaction.create(
        [
          {
            transactionReference: txnRef,
            type: "TRANSFER",
            amount: amountInPaise,
            senderAccountId: updatedSending.id,
            receiverAccountId: updatedReceiving.id,
            senderClientId: updatedSending.client_id,
            receiverClientId: updatedReceiving.client_id,
            status: "COMPLETED",
            balanceAfter: updatedSending.balance,
            idempotencyKey: idempotencyKey || null,
            description: req.body.description || `Transfer to Account ${updatedReceiving.id}`,
          },
        ],
        createOpts
      );

      const debitLegId = `LED-${Date.now()}-DR-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const creditLegId = `LED-${Date.now()}-CR-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      await LedgerEntry.create(
        [
          {
            ledgerId: debitLegId,
            transactionId: txn._id,
            transactionReference: txnRef,
            accountId: updatedSending.id.toString(),
            entryType: "DEBIT",
            amount: amountInPaise,
            balanceAfter: updatedSending.balance,
            description: `Debit for wire transfer to Account ${updatedReceiving.id}`,
          },
          {
            ledgerId: creditLegId,
            transactionId: txn._id,
            transactionReference: txnRef,
            accountId: updatedReceiving.id.toString(),
            entryType: "CREDIT",
            amount: amountInPaise,
            balanceAfter: updatedReceiving.balance,
            description: `Credit from wire transfer by Account ${updatedSending.id}`,
          },
        ],
        createOpts
      );

      return { updatedSending, updatedReceiving, txnRef };
    };

    let result;
    let session = null;
    try {
      session = await mongoose.startSession();
      session.startTransaction();
      result = await executeTransfer(session);
      await session.commitTransaction();
    } catch (sessionErr) {
      if (session) {
        try {
          await session.abortTransaction();
        } catch (_) {}
      }

      if (sessionErr.message === "INSUFFICIENT_FUNDS") {
        return res.status(400).send("Insufficient account balance for this transfer");
      }
      if (sessionErr.message === "RECEIVER_NOT_FOUND") {
        return res.status(404).send("Beneficiary account not found");
      }

      // If standalone MongoDB instance without replica set, execute cleanly without session
      if (sessionErr.code === 20 || sessionErr.message?.includes("replica set")) {
        result = await executeTransfer(null);
      } else if (sessionErr.code === 11000 && idempotencyKey) {
        const existingTx = await Transaction.findOne({ idempotencyKey });
        if (existingTx) {
          const sendingAcc = await Account.findById(fromId);
          const receivingAcc = await Account.findById(toId);
          req.transfered = {
            updatedSendingAccount: {
              ...sendingAcc.toObject(),
              balance: toRupees(sendingAcc.balance),
            },
            updatedReceivingAccount: {
              ...receivingAcc.toObject(),
              balance: toRupees(receivingAcc.balance),
            },
            balanceTransfered: toRupees(existingTx.amount),
            transactionReference: existingTx.transactionReference,
          };
          return next();
        }
        return res.status(409).send("Conflict: Simultaneous identical transaction already processed");
      } else {
        throw sessionErr;
      }
    } finally {
      if (session) {
        try {
          await session.endSession();
        } catch (_) {}
      }
    }

    const { updatedSending, updatedReceiving, txnRef } = result;

    req.transfered = {
      updatedSendingAccount: {
        ...updatedSending.toObject(),
        balance: toRupees(updatedSending.balance),
      },
      updatedReceivingAccount: {
        ...updatedReceiving.toObject(),
        balance: toRupees(updatedReceiving.balance),
      },
      balanceTransfered: toRupees(amountInPaise),
      transactionReference: txnRef,
    };
    return next();
  } catch (error) {
    if (error.message.match(/(transfer|id|Balance|Account)/gi))
      return res.status(400).send(error.message);
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Deposit Money (Pure MongoDB ACID Session + Double-Entry Ledger)
//@route  >>>> PUT /api/account/deposit/:id
//@Access >>>> private(for User only)
const deposit = async (req, res) => {
  const amountInPaise = toPaise(req.body.depositAmount);
  if (!amountInPaise || amountInPaise <= 0) {
    return res.status(400).send("Invalid deposit amount. Must be greater than 0");
  }

  const accountId = req.params.id;

  try {
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).send("Account not found");
    }

    // IDOR / Ownership check
    if (req.user && account.client_id !== req.user.id.toString() && req.user.role !== "admin") {
      return res.status(403).send("Forbidden: You do not have authorization to deposit to this account");
    }

    const executeDeposit = async (session) => {
      const opts = session ? { session, new: true } : { new: true };
      const createOpts = session ? { session } : {};

      const updatedAccount = await Account.findByIdAndUpdate(
        accountId,
        { $inc: { balance: amountInPaise } },
        opts
      );

      const txnRef = `DEP-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const [txn] = await Transaction.create(
        [
          {
            transactionReference: txnRef,
            type: "DEPOSIT",
            amount: amountInPaise,
            receiverAccountId: updatedAccount.id,
            receiverClientId: updatedAccount.client_id,
            status: "COMPLETED",
            balanceAfter: updatedAccount.balance,
            description: "Direct Gateway Deposit",
          },
        ],
        createOpts
      );

      const debitLegId = `LED-${Date.now()}-DR-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const creditLegId = `LED-${Date.now()}-CR-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      await LedgerEntry.create(
        [
          {
            ledgerId: debitLegId,
            transactionId: txn._id,
            transactionReference: txnRef,
            accountId: "SYSTEM_GATEWAY_CLEARING",
            entryType: "DEBIT",
            amount: amountInPaise,
            balanceAfter: null,
            description: `Clearing debit for gateway deposit to Account ${updatedAccount.id}`,
          },
          {
            ledgerId: creditLegId,
            transactionId: txn._id,
            transactionReference: txnRef,
            accountId: updatedAccount.id.toString(),
            entryType: "CREDIT",
            amount: amountInPaise,
            balanceAfter: updatedAccount.balance,
            description: "Customer deposit credit",
          },
        ],
        createOpts
      );

      return { updatedAccount, txnRef };
    };

    let result;
    let session = null;
    try {
      session = await mongoose.startSession();
      session.startTransaction();
      result = await executeDeposit(session);
      await session.commitTransaction();
    } catch (sessionErr) {
      if (session) {
        try {
          await session.abortTransaction();
        } catch (_) {}
      }
      if (sessionErr.code === 20 || sessionErr.message?.includes("replica set")) {
        result = await executeDeposit(null);
      } else {
        throw sessionErr;
      }
    } finally {
      if (session) {
        try {
          await session.endSession();
        } catch (_) {}
      }
    }

    const respObj = result.updatedAccount.toObject();
    respObj.balancePaise = result.updatedAccount.balance;
    respObj.balance = toRupees(result.updatedAccount.balance);
    return res.status(200).json(respObj);
  } catch (error) {
    if (error.message.match(/(Balance|Account)/gi))
      return res.status(400).send(error.message);
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Withdraw Money (Pure MongoDB ACID Session + Double-Entry Ledger)
//@route  >>>> PUT /api/account/withdraw/:id
//@Access >>>> private(for User only)
const withdraw = async (req, res) => {
  const amountInPaise = toPaise(req.body.withdrawAmount);
  if (!amountInPaise || amountInPaise <= 0) {
    return res.status(400).send("Invalid withdrawal amount. Must be greater than 0");
  }

  const accountId = req.params.id;

  try {
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).send("Account not found");
    }

    // IDOR / Ownership check
    if (req.user && account.client_id !== req.user.id.toString() && req.user.role !== "admin") {
      return res.status(403).send("Forbidden: You do not have authorization to withdraw from this account");
    }

    if (account.balance < amountInPaise) {
      return res.status(400).send("Insufficient balance for withdrawal");
    }

    const executeWithdraw = async (session) => {
      const opts = session ? { session, new: true } : { new: true };
      const createOpts = session ? { session } : {};

      const updatedAccount = await Account.findOneAndUpdate(
        { _id: accountId, balance: { $gte: amountInPaise } },
        { $inc: { balance: -amountInPaise } },
        opts
      );

      if (!updatedAccount) {
        throw new Error("INSUFFICIENT_FUNDS");
      }

      const txnRef = `WTH-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const [txn] = await Transaction.create(
        [
          {
            transactionReference: txnRef,
            type: "WITHDRAW",
            amount: amountInPaise,
            senderAccountId: updatedAccount.id,
            senderClientId: updatedAccount.client_id,
            status: "COMPLETED",
            balanceAfter: updatedAccount.balance,
            description: "Direct Account Withdrawal",
          },
        ],
        createOpts
      );

      const debitLegId = `LED-${Date.now()}-DR-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const creditLegId = `LED-${Date.now()}-CR-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      await LedgerEntry.create(
        [
          {
            ledgerId: debitLegId,
            transactionId: txn._id,
            transactionReference: txnRef,
            accountId: updatedAccount.id.toString(),
            entryType: "DEBIT",
            amount: amountInPaise,
            balanceAfter: updatedAccount.balance,
            description: "Cashout debit from customer account",
          },
          {
            ledgerId: creditLegId,
            transactionId: txn._id,
            transactionReference: txnRef,
            accountId: "SYSTEM_DISBURSEMENT",
            entryType: "CREDIT",
            amount: amountInPaise,
            balanceAfter: null,
            description: "Settlement credit for customer withdrawal",
          },
        ],
        createOpts
      );

      return { updatedAccount, txnRef };
    };

    let result;
    let session = null;
    try {
      session = await mongoose.startSession();
      session.startTransaction();
      result = await executeWithdraw(session);
      await session.commitTransaction();
    } catch (sessionErr) {
      if (session) {
        try {
          await session.abortTransaction();
        } catch (_) {}
      }
      if (sessionErr.message === "INSUFFICIENT_FUNDS") {
        return res.status(400).send("Insufficient balance for withdrawal");
      }
      if (sessionErr.code === 20 || sessionErr.message?.includes("replica set")) {
        result = await executeWithdraw(null);
      } else {
        throw sessionErr;
      }
    } finally {
      if (session) {
        try {
          await session.endSession();
        } catch (_) {}
      }
    }

    const respObj = result.updatedAccount.toObject();
    respObj.balancePaise = result.updatedAccount.balance;
    respObj.balance = toRupees(result.updatedAccount.balance);
    return res.status(200).json(respObj);
  } catch (error) {
    if (error.message.match(/(Balance|Account)/gi))
      return res.status(400).send(error.message);
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Get Financial Ledger / Double-Entry Audit Trail for Account
//@route  >>>> GET /api/account/ledger/:id
//@Access >>>> private(for User or Admin)
const getAccountLedger = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).send("Account Not Found");
    if (req.user && account.client_id !== req.user.id.toString() && req.user.role !== "admin") {
      return res.status(403).send("Forbidden: Cannot view another user's ledger");
    }

    const entries = await LedgerEntry.find({
      accountId: account.id.toString(),
    }).sort({ createdAt: -1 });

    const formattedEntries = entries.map((entry) => ({
      ...entry.toObject(),
      amountRupees: toRupees(entry.amount),
      balanceAfterRupees: entry.balanceAfter != null ? toRupees(entry.balanceAfter) : null,
    }));

    res.status(200).json(formattedEntries);
  } catch (error) {
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

module.exports = {
  createAccount,
  deleteAccount,
  getAccount,
  transfer,
  deposit,
  withdraw,
  getAccountLedger,
};
