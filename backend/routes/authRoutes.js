const express = require("express");

const router = express.Router();

const {

  sendOtp,
  verifyOtp,
  register,
  login,
  refreshToken,
  logout

} = require("../controllers/authController");

const {
  validateRegister,
  validateLogin
} = require("../middleware/validationMiddleware");


const { authMiddleware } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

router.get("/profile", authMiddleware, (req, res) => {
    res.json({
      message: "Protected route accessed",
      user: req.user
    });
  }
);

router.get("/admin", authMiddleware, roleMiddleware("admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin"
    });
  }
);

module.exports = router;