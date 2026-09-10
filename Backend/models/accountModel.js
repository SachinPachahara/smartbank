const mongoose = require("mongoose");
const { autoIncrement } = require("mongoose-plugin-autoinc");

//Define Account Schema
const accountSchema = new mongoose.Schema(
  {
    client_id: {
      type: String,
      required: [true, "Please Provide Client Id!"],
    },
    balance: {
      type: Number,
      default: 0,
      min: [0, "Balance cannot be less than 0 paise"],
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer paise value",
      },
    },
  },
  {
    timestamps: true,
    collection: "Accounts",
  }
);

//Auto Increament Account ID Plugin
accountSchema.plugin(autoIncrement, {
  model: "Account",
  startAt: 202511545300,
  incrementBy: 1,
});

//Define Account Model
const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
