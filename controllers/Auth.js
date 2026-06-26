const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { findOneAndUpdate } = require("../models/posts");

exports.signup = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      role,
      password,
      confirm_password,
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: "User already exists",
      });
    }

    if (password !== confirm_password) {
      return res.status(200).json({
        success: true,
        message: "Passwords do not match",
      });
    }

    let hashedPassword;
    let hashedConfirmPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
      hashedConfirmPassword = await bcrypt.hash(confirm_password, 10);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Unable to bcrypt",
        data: error.message,
      });
    }

    const user = await User.create({
      first_name,
      last_name,
      email,
      phone,
      role,
      password: hashedPassword,
      confirm_password: hashedConfirmPassword,
    });

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: error.message,
      message: "Internal server error",
    });
  }
};

// Login function
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not fount, Please Signup first",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Password",
      });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
    );

    // This may be optional
    user.token = token; //user ke andr token name ka field dal diya
    user.password = undefined; // for security purpose, jisse koi hmamara password na dekh ske
    user.confirm_password = undefined;

    // options ka mtlb cookie permission
    const options = {
      expires: new Date(Date.now() + 10 * 100000), // 1000000  miliseconds
      // expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), //3  days (where 1000 is 1000 miliseconds = 1 second)
      httpOnly: true, //for securing from XSS
    };
    // Here we are creating the cookie and send that into the response
    res.cookie("token", token, options).status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// Fetch All user
exports.getUsers = async (req, res) => {
  try {
    const user = await User.find({});
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "No user",
      });
    }
    res.status(200).json({
      success: true,
      message: "User found successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Fetch login user details
exports.getUserDetails = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "No user",
      });
    }
    res.status(200).json({
      success: true,
      message: "User found successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
