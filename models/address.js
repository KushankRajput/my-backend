const mongoose = require("mongoose");
const products = require("./products");

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: String,
  phone: String,
  pincode: Number,
  state: String,
  street_one: String,
  city: String,
});

module.exports = mongoose.model("Address", addressSchema);
