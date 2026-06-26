const Cart = require("../models/cart");
const Product = require("../models/products");

// Add item to cart
exports.addCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const userId = req.user.id;
    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: "product_id is required",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized. Please login",
      });
    }

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const unitPrice = product.price;
    const totalPrice = unitPrice * quantity;

    let cartItem = await Cart.findOne({
      userId: userId,
      productId: product_id,
    });

    if (cartItem) {
      // If product already in cart, update quantity & totalPrice
      cartItem.quantity += Number(quantity);
      cartItem.totalPrice = cartItem.quantity * cartItem.pricePerUnit;

      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        userId: userId,
        productId: product_id,
        quantity: quantity,
        pricePerUnit: unitPrice,
        totalPrice: totalPrice,
      });
    }

    // Correct aggregation syntax for total cart amount
    const cartTotalResult = await Cart.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);
    const cartTotal = cartTotalResult.length > 0 ? cartTotalResult[0].total : 0;

    return res.json({
      success: true,
      message: "Product added to cart successfully",
      item: cartItem,
      cart_total: cartTotal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// delete item from the cart
exports.deleteCart = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "No cart found of the user",
      });
    }

    const cartItem = await Cart.findOneAndDelete({ userId });
    return res.json({
      success: true,
      message: "Cart deleted successfully",
      item: cartItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// fetch items from cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "No cart found of the user",
      });
    }

    const cartItem = await Cart.findOne({ userId });
    return res.json({
      success: true,
      message: "Cart fetched successfully",
      item: cartItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// delete a specific item from cart
exports.deleteProductFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.body;
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "No cart found of the user",
      });
    }
    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: "product_id is required",
      });
    }

    const cartItem = await Cart.findOneAndDelete({
      userId: userId,
      productId: product_id,
    });
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    const cartTotalResult = await Cart.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    const cartTotal = cartTotalResult.length > 0 ? cartTotalResult[0].total : 0;
    return res.json({
      success: true,
      message: "product successfully deleted from cart",
      item: cartItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
