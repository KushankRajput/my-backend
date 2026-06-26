const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
    },
    otp_created_at: {
      type: Date,
    },
    status: {
      type: String,
      default: "active",
    },
    token: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true,
    },
    confirm_password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Visitor", "Student"],
      default: "Visitor",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
