const userModel = require("../models/user.model");
const paymentModel = require("../models/payment.model");
const productModel = require("../models/product.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Helper function to sanitize user object by removing password
const sanitizeUser = (user) => {
  const safe = user.toObject();
  delete safe.password;
  return safe;
};

const registerUser = async (req, res) => {
  try {
    const {
      username,
      email,
      fullname: { firstName, lastName },
      password,
    } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const isUserAlreadyExists = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserAlreadyExists) {
      return res.status(422).json({
        message:
          isUserAlreadyExists.username === username
            ? "username already exists"
            : "email already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      fullname: {
        firstName,
        lastName,
      },
      password: hashPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

async function loginUser(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const user = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).json({
      message: "user logged in successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function registerSeller(req, res) {
  try {
    const {
      username,
      email,
      fullname: { firstName, lastName },
      password,
    } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const isSellerAlreadyExists = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    console.log("Register seller check:", {
      username,
      email,
      isSellerAlreadyExists,
    });

    if (isSellerAlreadyExists) {
      return res.status(422).json({
        message:
          isSellerAlreadyExists.username === username
            ? "username already exists"
            : "email already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const seller = await userModel.create({
      username,
      email,
      fullname: {
        firstName,
        lastName,
      },
      password: hashPassword,
      role: "seller",
    });

    const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(201).json({
      message: "Seller registered successfully!",
      seller: sanitizeUser(seller),
    });
  } catch (error) {
    console.error("Error in registerSeller:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function loginSeller(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const seller = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (!seller) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, seller.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).json({
      message: "Seller logged in successfully",
      seller: sanitizeUser(seller),
    });
  } catch (error) {
    console.error("Error in loginSeller:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function logoutUser(req, res) {
  try {
    res.clearCookie("token");
    res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function updateUserRole(req, res) {
  try {
    const { role } = req.body;
    const userId = req.user._id;

    const user = await userModel.findByIdAndUpdate(
      userId,
      { role: role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User role updated successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function getUserPurchases(req, res) {
  try {
    const userId = req.user._id;

    const purchases = await paymentModel
      .find({ user: userId, status: "Success" })
      .populate("product_id")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Purchases retrieved successfully",
      purchases,
    });
  } catch (error) {
    console.error("Error in getUserPurchases:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function updateUserProfile(req, res) {
  try {
    const userId = req.user._id;
    const { username, fullname } = req.body;

    // Check if username is already taken by another user
    if (username) {
      const existingUser = await userModel.findOne({
        username,
        _id: { $ne: userId },
      });
      if (existingUser) {
        return res.status(422).json({
          message: "Username already exists",
        });
      }
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (fullname) updateData.fullname = fullname;

    const user = await userModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  registerUser,
  loginUser,
  registerSeller,
  loginSeller,
  logoutUser,
  updateUserRole,
  getUserPurchases,
  updateUserProfile,
};
