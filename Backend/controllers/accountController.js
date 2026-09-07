const Account = require("../models/accountModel");
const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");

//@desc   >>>> Create Account
//@route  >>>> POST /api/account/create
//@Access >>>> Private (through admin approve only)
const createAccount = async (req, res, next) => {
  try {
    const account = await Account.create({
      client_id: req.body.id,
      balance: req.body.balance,
    });
    //go to notification
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

//@desc   >>>> Get account
//@route  >>>> GET /api/account/:id
//@Access >>>> private(User)
const getAccount = async (req, res) => {
  let account;
  try {
    account = await Account.findById(req.params.id);
    res.status(200).json(account);
  } catch (error) {
    if (!account) return res.status(404).send("Account Not Found!");
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Delete Account
//@route  >>>> DELETE /api/account/:id
//@Access >>>> private(for user only)
const deleteAccount = async (req, res) => {
  try {
    const deletedAccount = await Account.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: deletedAccount.id });
  } catch (error) {
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Transfer Money (ACID Safe + Atomic Concurrency Protection)
//@route  >>>> PUT /api/account/transfer/:from_id/:to_id
//@Access >>>> private(for User only)
const transfer = async (req, res, next) => {
  const amount = Number(req.body.balanceTransfered);
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).send("Invalid transfer amount. Must be greater than 0");
  }

  const fromId = req.params.from_id;
  const toId = req.params.to_id;

  if (fromId === toId) {
    return res.status(400).send("Sender and receiver accounts cannot be the same");
  }

  const idempotencyKey = req.headers["idempotency-key"] || req.body.idempotencyKey;
  if (idempotencyKey) {
    const existingTx = await Transaction.findOne({ idempotencyKey });
    if (existingTx && existingTx.status === "COMPLETED") {
      const sendingAcc = await Account.findById(fromId);
      req.transfered = {
        updatedSendingAccount: sendingAcc,
        updatedReceivingAccount: await Account.findById(toId),
        balanceTransfered: amount,
      };
      return next();
    }
  }

  try {
    const sendingAccount = await Account.findById(fromId);
    if (!sendingAccount) {
      return res.status(404).send("Sender account not found");
    }

    if (req.user && sendingAccount.client_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).send("Forbidden: You do not have authorization to transfer from this account");
    }

    const receivingAccount = await Account.findById(toId);
    if (!receivingAccount) {
      return res.status(404).send("Beneficiary account not found");
    }

    if (sendingAccount.balance < amount) {
      return res.status(400).send("Insufficient account balance for this transfer");
    }

    let session = null;
    let transactionCommitted = false;
    try {
      session = await mongoose.startSession();
      session.startTransaction();

      const updatedSending = await Account.findOneAndUpdate(
        { _id: fromId, balance: { $gte: amount } },
        {
          $inc: { balance: -amount },
          $push: {
            out: {
              to: receivingAccount.id,
              balance_transfered: amount,
            },
          },
        },
        { session, new: true }
      );

      if (!updatedSending) {
        await session.abortTransaction();
        await session.endSession();
        return res.status(400).send("Transfer aborted: Insufficient funds or concurrent update conflict");
      }

      const updatedReceiving = await Account.findByIdAndUpdate(
        toId,
        {
          $inc: { balance: amount },
          $push: {
            in: {
              from: updatedSending.id,
              balance_transfered: amount,
            },
          },
        },
        { session, new: true }
      );

      const txnRef = `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      await Transaction.create(
        [
          {
            transactionReference: txnRef,
            type: "TRANSFER",
            amount,
            senderAccountId: updatedSending.id,
            receiverAccountId: updatedReceiving.id,
            senderClientId: updatedSending.client_id,
            receiverClientId: updatedReceiving.client_id,
            status: "COMPLETED",
            balanceAfter: updatedSending.balance,
            idempotencyKey: idempotencyKey || null,
            description: req.body.description || `Transfer to ${updatedReceiving.id}`,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      await session.endSession();
      transactionCommitted = true;

      req.transfered = {
        updatedSendingAccount: updatedSending,
        updatedReceivingAccount: updatedReceiving,
        balanceTransfered: amount,
      };
      return next();
    } catch (sessionErr) {
      if (session) {
        try {
          await session.abortTransaction();
          await session.endSession();
        } catch (_) {}
      }

      // Standalone MongoDB fallback: Atomic conditional operation with automatic rollback
      if (!transactionCommitted) {
        const updatedSending = await Account.findOneAndUpdate(
          { _id: fromId, balance: { $gte: amount } },
          {
            $inc: { balance: -amount },
            $push: {
              out: {
                to: receivingAccount.id,
                balance_transfered: amount,
              },
            },
          },
          { new: true }
        );

        if (!updatedSending) {
          return res.status(400).send("Transfer failed: Insufficient balance or race condition detected");
        }

        let updatedReceiving;
        try {
          updatedReceiving = await Account.findByIdAndUpdate(
            toId,
            {
              $inc: { balance: amount },
              $push: {
                in: {
                  from: updatedSending.id,
                  balance_transfered: amount,
                },
              },
            },
            { new: true }
          );

          if (!updatedReceiving) {
            throw new Error("Receiver account not reachable");
          }
        } catch (credErr) {
          await Account.findByIdAndUpdate(fromId, {
            $inc: { balance: amount },
            $pop: { out: 1 },
          });
          return res.status(500).send("Transfer failed during credit. Sender balance safely refunded.");
        }

        const txnRef = `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        await Transaction.create({
          transactionReference: txnRef,
          type: "TRANSFER",
          amount,
          senderAccountId: updatedSending.id,
          receiverAccountId: updatedReceiving.id,
          senderClientId: updatedSending.client_id,
          receiverClientId: updatedReceiving.client_id,
          status: "COMPLETED",
          balanceAfter: updatedSending.balance,
          idempotencyKey: idempotencyKey || null,
          description: req.body.description || `Transfer to ${updatedReceiving.id}`,
        });

        req.transfered = {
          updatedSendingAccount: updatedSending,
          updatedReceivingAccount: updatedReceiving,
          balanceTransfered: amount,
        };
        return next();
      }
    }
  } catch (error) {
    if (error.message.match(/(transfer|id|Balance|Account)/gi))
      return res.status(400).send(error.message);
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Deposit Money (Atomic Increments & Ledger Logging)
//@route  >>>> PUT /api/account/deposit/:id
//@Access >>>> private(for User only)
const deposit = async (req, res) => {
  const amount = Number(req.body.depositAmount);
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).send("Invalid deposit amount. Must be greater than 0");
  }

  try {
    const updatedAccount = await Account.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { balance: amount },
        $push: {
          deposit_logs: {
            depositted_amount: amount,
          },
        },
      },
      { new: true }
    );

    if (!updatedAccount) {
      return res.status(404).send("Account not found");
    }

    const txnRef = `DEP-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    await Transaction.create({
      transactionReference: txnRef,
      type: "DEPOSIT",
      amount,
      receiverAccountId: updatedAccount.id,
      receiverClientId: updatedAccount.client_id,
      status: "COMPLETED",
      balanceAfter: updatedAccount.balance,
      description: "Direct Account Deposit",
    });

    res.status(200).json(updatedAccount);
  } catch (error) {
    if (error.message.match(/(Balance|Account)/gi))
      return res.status(400).send(error.message);
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Withdraw Money (Atomic Decrement & Negative-Guard)
//@route  >>>> PUT /api/account/withdraw/:id
//@Access >>>> private(for User only)
const withdraw = async (req, res) => {
  const amount = Number(req.body.withdrawAmount);
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).send("Invalid withdrawal amount. Must be greater than 0");
  }

  try {
    const updatedAccount = await Account.findOneAndUpdate(
      { _id: req.params.id, balance: { $gte: amount } },
      {
        $inc: { balance: -amount },
        $push: {
          withdraw_logs: {
            withdrawed_amount: amount,
          },
        },
      },
      { new: true }
    );

    if (!updatedAccount) {
      return res.status(400).send("Withdrawal failed: Insufficient funds or invalid account");
    }

    const txnRef = `WTH-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    await Transaction.create({
      transactionReference: txnRef,
      type: "WITHDRAW",
      amount,
      senderAccountId: updatedAccount.id,
      senderClientId: updatedAccount.client_id,
      status: "COMPLETED",
      balanceAfter: updatedAccount.balance,
      description: "Direct Account Withdrawal",
    });

    res.status(200).json(updatedAccount);
  } catch (error) {
    if (error.message.match(/(Balance|Account)/gi))
      return res.status(400).send(error.message);
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Get Financial Ledger / Audit Trail for Account
//@route  >>>> GET /api/account/ledger/:id
//@Access >>>> private(for User or Admin)
const getAccountLedger = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).send("Account Not Found");
    if (req.user && account.client_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).send("Forbidden: Cannot view another user's ledger");
    }
    const transactions = await Transaction.find({
      $or: [
        { senderAccountId: account.id.toString() },
        { receiverAccountId: account.id.toString() },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json(transactions);
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
