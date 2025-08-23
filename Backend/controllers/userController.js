import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import { fileURLToPath } from 'url';
import path from 'path';

// Load environment variables
import dotenv from 'dotenv';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Initialize Google OAuth2 client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Send OTP
const sendOTPEmail = async (email, otp) => {
    try {
        await transporter.sendMail({
            from: `"Job Portal" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">Job Portal Verification</h2>
                    <p>Your verification code is:</p>
                    <h1 style="font-size: 32px; letter-spacing: 5px; color: #2563eb; background: #f3f4f6; padding: 10px; text-align: center; border-radius: 5px;">
                        ${otp}
                    </h1>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you didn't request this code, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                    <p style="color: #6b7280; font-size: 14px;">This is an automated message, please do not reply.</p>
                </div>
            `,
        });
        return { success: true };
    } catch (error) {
        console.error("Error sending OTP email:", error);
        return { success: false, error: error.message };
    }
};

// Register User
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000;

        const user = new User({
            name,
            email,
            role,
            passwordHash: hashedPassword,
            otp,
            otpExpires,
            isVerified: false,
        });

        await user.save();

        const emailResult = await sendOTPEmail(email, otp);
        if (!emailResult.success) {
            console.error("Failed to send OTP email:", emailResult.error);
            return res.status(500).json({
                message: "Registration completed but failed to send OTP email. Please try resending OTP."
            });
        }

        res.status(201).json({ message: "Registration successful. Please verify your email with the OTP sent." });
    } catch (err) {
        res.status(500).json({ message: "Server error during registration.", error: err.message });
    }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "Account is already verified." });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            // Securely remove the OTP after an invalid attempt to prevent brute force
            user.otp = null;
            user.otpExpires = null;
            await user.save();
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        user.isVerified = true;
        user.otp = undefined; // Use undefined to remove the field from the document
        user.otpExpires = undefined;
        await user.save();

        // Generate token after successful verification
        const token = generateToken(user._id, user.role);

        res.json({
            message: "Account verified successfully!",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Server error during OTP verification.", error: err.message });
    }
};

// Resend OTP
export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "Account is already verified." });
        }

        // Check if we should wait before resending (prevent spam)
        const lastOtpSent = user.otpLastSent || 0;
        const currentTime = Date.now();
        const timeSinceLastOtp = currentTime - lastOtpSent;

        // Prevent resending OTP more than once every 60 seconds
        if (timeSinceLastOtp < 60000) {
            const waitTime = Math.ceil((60000 - timeSinceLastOtp) / 1000);
            return res.status(429).json({
                message: `Please wait ${waitTime} seconds before requesting a new OTP.`
            });
        }

        // Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Update user with new OTP
        user.otp = otp;
        user.otpExpires = otpExpires;
        user.otpLastSent = currentTime;
        await user.save();

        // Send new OTP email
        const emailResult = await sendOTPEmail(email, otp);
        if (!emailResult.success) {
            console.error("Failed to resend OTP email:", emailResult.error);
            return res.status(500).json({
                message: "Failed to resend OTP email. Please try again later."
            });
        }

        res.json({ message: "New OTP has been sent to your email." });
    } catch (err) {
        res.status(500).json({ message: "Server error while resending OTP.", error: err.message });
    }
};

// Login User
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        if (!user.isVerified) {
            // Optionally resend OTP if not verified
            return res.status(403).json({
                message: "Account not verified. Please check your email for the OTP.",
                needsVerification: true,
                email: user.email
            });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const token = generateToken(user._id, user.role);

        res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Server error during login.", error: err.message });
    }
};

// Google Auth
export const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;  // Expecting plain string

        if (!token || typeof token !== "string") {
            return res.status(400).json({ message: "Invalid Google token received." });
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return res.status(401).json({ message: "Invalid Google token or missing email." });
        }

        const { name, email, sub: googleId } = payload;

        let user = await User.findOne({ email });

        if (user) {
            if (!user.googleId) {
                user.googleId = googleId;
                user.isVerified = true;
                await user.save();
            }
        } else {
            user = new User({
                name,
                email,
                googleId,
                isVerified: true,
                role: "seeker",
            });
            await user.save();
        }

        const appToken = generateToken(user._id, user.role);

        return res.status(200).json({
            token: appToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(500).json({ message: "Google login failed.", error: error.message });
    }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        await sendOTPEmail(email, otp);

        res.json({ message: "Password reset OTP sent to your email." });
    } catch (err) {
        res.status(500).json({ message: "Server error during password reset request.", error: err.message });
    }
};

// Reset Password with OTP
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        user.passwordHash = await bcrypt.hash(newPassword, 10);
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ message: "Password has been successfully reset." });
    } catch (err) {
        res.status(500).json({ message: "Server error during password reset.", error: err.message });
    }
};

// Get User Profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-passwordHash -otp -otpExpires");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching user profile.", error: error.message });
    }
};

// Update User Profile
export const updateUserProfile = async (req, res) => {
    try {
        const updates = { ...req.body };
        const userId = req.user.id;

        if (updates.password) {
            updates.passwordHash = await bcrypt.hash(updates.password, 10);
            delete updates.password; // Remove plain text password
        }

        const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).select("-passwordHash -otp -otpExpires");

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json({ message: "Profile updated successfully.", user });
    } catch (error) {
        res.status(500).json({ message: "Server error while updating profile.", error: error.message });
    }
};