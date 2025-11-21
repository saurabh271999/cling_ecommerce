import express from "express";
import passport from "passport";
import {
  signup,
  login,
  verifyOTP,
  resendOTP,
  googleAuth,
  googleCallback,
  logout,
  getCurrentUser,
  updateProfile,
} from "../../controller/authcontroller/userauth.js";

const router = express.Router();

// User signup
router.post("/signup", signup);

// Verify OTP
router.post("/verify-otp", verifyOTP);

// Resend OTP
router.post("/resend-otp", resendOTP);

// User login
router.post("/login", login);

// Google OAuth routes
router.get(
  "/google",
  googleAuth,
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/callback/google",
  passport.authenticate("google", { session: false }),
  googleCallback
);

// Logout
router.post("/logout", logout);

// Get current user
router.get("/current_user", getCurrentUser);

// Update user profile
router.put("/profile", updateProfile);

export default router;

