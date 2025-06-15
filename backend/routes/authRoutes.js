import express from "express";
const router = express.Router();
import passport from "passport";
import {
  register,
  verifyOTP,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  logout,
  googleAuth,
} from "../controllers/authController.js";
// import { protect } from "../middlewares/auth.js";

// Public routes
router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword", resetPassword);
router.post("/google", googleAuth);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, generate JWT
    const token = req.user.getSignedJwtToken();
    res.redirect(`${process.env.FRONTEND_URL}/oauth?token=${token}`);
  }
);

// Protected routes
router.get("/me/:id", getMe);
router.get("/logout", logout);

export default router;
