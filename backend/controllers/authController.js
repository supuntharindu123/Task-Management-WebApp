import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import OTP from "../models/OTP.js";
import ErrorResponse from "../utils/errorResponse.js";
import sendEmail from "../utils/emailService.js";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export async function register(req, res, next) {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      return next(new ErrorResponse("User already exists", 400));
    }

    // Create user (not verified yet)
    user = await User.create({
      name,
      email,
      password,
    });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ email, otp });

    // Send verification email
    const message = `Your verification code is: ${otp}`;
    await sendEmail({
      email: user.email,
      subject: "Email Verification Code",
      message,
    });

    res.status(200).json({
      success: true,
      data: "Verification code sent to email",
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Verify OTP and activate user
// @route   POST /api/auth/verify-otp
// @access  Public
export async function verifyOTP(req, res, next) {
  const { email, otp } = req.body;

  try {
    // Find the most recent OTP for the email
    const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!otpRecord || otpRecord.otp !== otp) {
      return next(new ErrorResponse("Invalid OTP", 400));
    }

    // Update user as verified
    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    // Validate email & password
    if (!email || !password) {
      return next(
        new ErrorResponse("Please provide an email and password", 400)
      );
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // // Check if user is verified
    // if (!user.isVerified) {
    //   return next(new ErrorResponse("Please verify your email first", 401));
    // }

    // Check if user is active
    // if (!user.isActive) {
    //   return next(new ErrorResponse("Account has been deactivated", 401));
    // }

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      id: user._id,
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export async function getMe(req, res, next) {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
export async function forgotPassword(req, res, next) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse("No user with that email", 404));
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ email, otp });

    // Send email
    const message = `Your password reset code is: ${otp}`;
    await sendEmail({
      email: user.email,
      subject: "Password Reset Code",
      message,
    });

    res.status(200).json({
      success: true,
      data: "Email sent",
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Reset password
// @route   PUT /api/auth/resetpassword
// @access  Public
export async function resetPassword(req, res, next) {
  const { email, otp, newPassword } = req.body;

  try {
    // Verify OTP
    const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!otpRecord || otpRecord.otp !== otp) {
      return next(new ErrorResponse("Invalid OTP", 400));
    }

    // Update password
    const user = await User.findOne({ email }).select("+password");
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      data: "Password updated successfully",
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
export async function logout(req, res, next) {
  try {
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Google auth
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    
    let user = await User.findOne({ email: payload.email });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        name: payload.name,
        email: payload.email,
        password: Math.random().toString(36).slice(-8), // Generate random password
        isVerified: true, // Google users are already verified
        role: 'user'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(200).json({
      success: true,
      token,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    next(error);
  }
};
