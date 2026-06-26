const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cart_id: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
    address_id: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },

    total_amount: Number,

    status: { type: String, default: "pending" },

    tracking_number: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
