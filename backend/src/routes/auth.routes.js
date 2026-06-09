const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authUser } = require("../middlewares/auth.middleware");
const userModel = require("../models/user.model");

router.get("/me", authUser, async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

//user
router.post("/user/register", authController.registerUser);
router.post("/user/login", authController.loginUser);
router.get("/user/logout", authController.logoutUser);
router.put("/user/role", authUser, authController.updateUserRole);
router.get("/user/purchases", authUser, authController.getUserPurchases);
router.put("/user/profile", authUser, authController.updateUserProfile);

//seller
router.post("/seller/register", authController.registerSeller);
router.post("/seller/login", authController.loginSeller);

module.exports = router;
