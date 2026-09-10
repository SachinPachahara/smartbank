const mongoose = require("mongoose");
const { autoIncrement } = require("mongoose-plugin-autoinc");

//Define Account request Schema
const AccountRequestSchema = new mongoose.Schema(
  {
    client_id: {
      type: String,
      required: [true, "please provide client id"],
    },
    initial_balance: {
      type: Number,
      required: [true, "please provide initial balance"],
      min: [500, "Initial Balance Cannot be less than 500"],
    },
  },
  {
    timestamps: true,
    collection: "AccountRequests",
  }
);

//Auto Increament AccountRequest ID Plugin
AccountRequestSchema.plugin(autoIncrement, {
  model: "AccountRequest",
  startAt: 202311500300,
  incrementBy: 1,
});

//Define Account Request Model
const AccountRequest = mongoose.model("AccountRequest", AccountRequestSchema);

module.exports = AccountRequest;
