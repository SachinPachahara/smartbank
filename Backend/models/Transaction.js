const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    transactionReference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["TRANSFER", "DEPOSIT", "WITHDRAW"],
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Transaction amount in paise is required"],
      min: [1, "Amount must be at least 1 paise"],
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer paise value",
      },
    },
    senderAccountId: {
      type: String,
      default: null,
      index: true,
    },
    receiverAccountId: {
      type: String,
      default: null,
      index: true,
    },
    senderClientId: {
      type: String,
      default: null,
    },
    receiverClientId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["COMPLETED", "FAILED", "REVERSED", "PENDING"],
      default: "COMPLETED",
    },
    idempotencyKey: {
      type: String,
      sparse: true,
      unique: true,
      index: true,
    },
    balanceAfter: {
      type: Number,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "Transactions",
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
