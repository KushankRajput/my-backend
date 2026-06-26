const mongoose = require("mongoose");
const User = require("../models/user");
const Address = require("../models/address");
const Cart = require("../models/cart");
const Product = require("../models/products");
const Order = require("../models/order");
const crypto = require("crypto");

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cart_id, address_id } = req.body;

    if (!cart_id || !address_id) {
      return res.status(400).json({
        success: false,
        message: "cart_id and address_id are required",
      });
    }
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const address = await Address.find({ userId: userId });
    if (!address)
      return res
        .status(404)
        .json({ success: false, message: "No Address found for this user" });

    const selectedAddress = await Address.findOne({
      _id: address_id,
      userId,
    });

    const cart = await Cart.findById(cart_id);
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const cartItem = await Cart.find({ userId });
    if (cartItem.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Check stock
    for (const item of cartItem) {
      const product = await Product.findById(item.productId);

      if (!product || product.stock <= item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product ${item.productId}`,
        });
      }

      product.stock -= item.quantity;
      await product.save();
    }

    let productTotal = cartItem.reduce((sum, i) => sum + i.totalPrice, 0);

    const trackingNumber =
      "ORD." + crypto.randomBytes(5).toString("hex").toUpperCase();

    const order = await Order.create({
      customer_id: userId,
      cart_id,
      address_id: selectedAddress._id,
      total_amount: productTotal,
      status: "pending",
      tracking_number: trackingNumber,
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: order,
    });
  } catch (error) {
    console.error("Order error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while placing order",
      error: error.message,
    });
  }
};
