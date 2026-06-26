const Address = require("../models/address");

exports.createAddress = async (req, res) => {
  try {
    const userId = req.user.id;

    const address = await Address.create({
      userId,
      ...req.body,
    });

    return res.status(201).json({
      success: true,
      message: "Address created successfully",
      data: address,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create address",
      error: error.message,
    });
  }
};

exports.getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await Address.find({ userId });

    return res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
      error: error.message,
    });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const userId = req.user.id;

    const updated = await Address.findByIdAndUpdate(
      { _id: addressId, userId: userId },
      req.body,
      {
        new: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Address updated",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message,
    });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.id;

    await Address.findByIdAndDelete({ _id: addressId, userId: userId });

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete address",
      error: error.message,
    });
  }
};
