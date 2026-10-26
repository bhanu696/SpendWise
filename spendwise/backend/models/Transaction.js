
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Transaction title is required"],
      trim: true,
      maxlength: 100,
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, "Amount must be greater than zero"],
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Food",
        "Transport",
        "Utilities",
        "Shopping",
        "Income",
        "Other",
      ],
    },
    date: {
      type: String,
      required: true,
    },

    user:   {
  type: require("mongoose").Schema.Types.ObjectId,
  ref: "User",
  required: true,
  index: true,
},
  },
  
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
