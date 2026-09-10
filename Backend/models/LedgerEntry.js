const mongoose = require("mongoose");

const ledgerEntrySchema = new mongoose.Schema(
  {
    ledgerId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
      index: true,
    },
    transactionReference: {
      type: String,
      required: true,
      index: true,
    },
    accountId: {
      type: String,
      required: true,
      index: true,
    },
    entryType: {
      type: String,
      enum: ["DEBIT", "CREDIT"],
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Ledger amount in paise is required"],
      min: [1, "Ledger amount must be at least 1 paise"],
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer paise value",
      },
    },
    balanceAfter: {
      type: Number,
      default: null,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "LedgerEntries",
  }
);

const LedgerEntry = mongoose.model("LedgerEntry", ledgerEntrySchema);

module.exports = LedgerEntry;
