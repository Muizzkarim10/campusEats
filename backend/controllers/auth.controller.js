import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// In-memory storage for reset codes (use Redis in production)
const resetCodes = new Map();

export const registerUser = async (req, res) => {
  try {
    const { name, regNo, email, phone, password } = req.body;

    if (!regNo) {
      return res
        .status(400)
        .json({ message: "Registration number is required" });
    }

    const normalizedRegNo = regNo.trim().toUpperCase();

    const existingUser = await User.findOne({
      $or: [{ regNo: normalizedRegNo }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this registration or email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      regNo: normalizedRegNo,
      email,
      phone,
      password: hashedPassword,
      balance: 0,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        regNo: newUser.regNo,
        email: newUser.email,
        phone: newUser.phone,
        balance: newUser.balance || 0,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { regNo, email, password } = req.body;

    if (!regNo && !email) {
      return res
        .status(400)
        .json({ message: "Registration number (or email) is required" });
    }

    let user;
    if (regNo) {
      const normalizedRegNo = regNo.trim().toUpperCase();
      user = await User.findOne({
        $or: [{ regNo: normalizedRegNo }, { email: regNo }],
      });
    } else {
      user = await User.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        regNo: user.regNo,
        email: user.email,
        phone: user.phone,
        balance: user.balance || 0,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, current password and new password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({
      success: false,
      message: err?.message || "Server error",
    });
  }
};

// FORGOT PASSWORD - Step 1: Request reset code
export const forgotPassword = async (req, res) => {
  try {
    console.log("Forgot password endpoint hit:", req.body);

    const { regNo } = req.body;

    if (!regNo) {
      return res.status(400).json({
        success: false,
        message: "Registration number is required",
      });
    }

    const normalizedRegNo = regNo.trim().toUpperCase();

    const user = await User.findOne({ regNo: normalizedRegNo });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this registration number",
      });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = Date.now() + 15 * 60 * 1000;
    resetCodes.set(normalizedRegNo, {
      code: resetCode,
      expiresAt,
      email: user.email,
    });

    console.log(`Reset code for ${user.email}: ${resetCode}`);

    res.json({
      success: true,
      message: "Reset code generated successfully",
      devCode: resetCode,
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// VERIFY RESET CODE - Step 2: Verify the code
export const verifyResetCode = async (req, res) => {
  try {
    console.log("Verify code endpoint hit:", req.body);

    const { regNo, code } = req.body;

    if (!regNo || !code) {
      return res.status(400).json({
        success: false,
        message: "Registration number and code are required",
      });
    }

    const normalizedRegNo = regNo.trim().toUpperCase();

    const resetData = resetCodes.get(normalizedRegNo);
    if (!resetData) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset code",
      });
    }

    if (Date.now() > resetData.expiresAt) {
      resetCodes.delete(normalizedRegNo);
      return res.status(400).json({
        success: false,
        message: "Reset code has expired. Please request a new one.",
      });
    }

    if (resetData.code !== code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid reset code. Please check and try again.",
      });
    }

    res.json({
      success: true,
      message: "Code verified successfully",
    });
  } catch (err) {
    console.error("Verify code error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// RESET PASSWORD - Step 3: Actually reset the password
export const resetPassword = async (req, res) => {
  try {
    console.log("Reset password endpoint hit:", req.body);

    const { regNo, code, newPassword } = req.body;

    if (!regNo || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Registration number, code, and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const normalizedRegNo = regNo.trim().toUpperCase();

    const resetData = resetCodes.get(normalizedRegNo);
    if (
      !resetData ||
      resetData.code !== code.trim() ||
      Date.now() > resetData.expiresAt
    ) {
      resetCodes.delete(normalizedRegNo);
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset code",
      });
    }

    const user = await User.findOne({ regNo: normalizedRegNo });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    resetCodes.delete(normalizedRegNo);

    res.json({
      success: true,
      message:
        "Password reset successfully! You can now login with your new password.",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Add balance to user account (called by admin)
export const addBalance = async (req, res) => {
  try {
    const { email, amount } = req.body;

    if (!email || !amount) {
      return res.status(400).json({
        success: false,
        message: "Email and amount are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.balance = (user.balance || 0) + parseFloat(amount);
    await user.save();

    console.log(`Balance added for user ${user.email}: ${user.balance}`);

    res.json({
      success: true,
      message: `PKR ${amount} added successfully`,
      newBalance: user.balance,
    });
  } catch (err) {
    console.error("Add balance error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update user balance (for syncing frontend with backend)
export const updateBalance = async (req, res) => {
  try {
    const { userId } = req.params;
    const { balance } = req.body;

    console.log(
      `Update balance request - userId: ${userId}, balance: ${balance}`
    );

    if (balance === undefined || balance < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid balance value",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.balance = parseFloat(balance);
    await user.save();

    console.log(`Balance updated for user ${user.email}: ${balance}`);

    return res.json({
      success: true,
      message: "Balance updated successfully",
      balance: user.balance,
    });
  } catch (err) {
    console.error("Update balance error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get user balance
export const getUserBalance = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      balance: user.balance || 0,
    });
  } catch (err) {
    console.error("Get balance error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// NEW: Update balance by email (for admin dashboard approvals)
export const updateBalanceByEmail = async (req, res) => {
  try {
    const { email, amount, operation } = req.body;

    console.log("updateBalanceByEmail called:", { email, amount, operation });

    if (!email || !amount || !operation) {
      return res.status(400).json({
        success: false,
        message: "Email, amount, and operation are required",
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }

    // Update balance based on operation
    if (operation === "add") {
      user.balance = (user.balance || 0) + Number(amount);
    } else if (operation === "subtract") {
      user.balance = Math.max(0, (user.balance || 0) - Number(amount));
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid operation. Use "add" or "subtract"',
      });
    }

    await user.save();

    console.log(
      `Balance ${operation}ed for user ${user.email}: ${user.balance}`
    );

    return res.status(200).json({
      success: true,
      balance: user.balance,
      message: "Balance updated successfully",
    });
  } catch (error) {
    console.error("Error updating balance by email:", error);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};
