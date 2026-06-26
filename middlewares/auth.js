const jwt = require("jsonwebtoken");

// Here we will write a middleware for authentication

exports.auth = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    // const token = req.body.token;  //in this case you need to send token in request
    // const token = req.cookies.token; //cookie me agar token hai to vaha se nikal lo

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please authenticate using a valid token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); //yaha pr hum sari user ki value ko verify kr rhe hai
    req.user = decoded; // yaha pr hmne token ke ke andr ki sari info (user role,email,name etc..) req.user me store krdi)

    next(); //to move on to the next middleware
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.role !== "Student") {
      return res.status(401).json({
        success: false,
        message: "Access denied. Student only.",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};
