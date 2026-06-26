const Product = require("../models/products");
exports.addProduct = async (req, res) => {
  try {
    const { name, price, stock } = req.body;

    // Validation
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required",
      });
    }

    // Create product
    const product = await Product.create({
      name,
      price,
      stock: stock || 1,
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message,
    });
  }
};
