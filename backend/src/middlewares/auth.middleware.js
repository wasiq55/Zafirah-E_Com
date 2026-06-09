const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

// Helper function to sanitize user object by removing password
const sanitizeUser = (user) => {
  const safe = user.toObject();
  delete safe.password;
  return safe;
};

const authSeller = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      msg: "Unauthorized!",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id);

    if (user.role !== "seller") {
      return res.status(403).json({
        msg: "forbidden, you don't have required role!",
      });
    }

    req.seller = sanitizeUser(user);

    next();
  } catch (error) {
    res.status(401).json({
      msg: "Unauthorized!",
    });
  }
};

const authUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      msg: "Unauthorized, token not found",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id);

    req.user = sanitizeUser(user);

    next();
  } catch (error) {
    res.status(401).json({
      msg: "Unauthorized",
      error: error,
    });
  }
};

module.exports = { authSeller, authUser };
