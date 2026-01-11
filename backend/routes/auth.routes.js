import express from "express";
import {
  registerUser,
  loginUser,
  changePassword,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  addBalance,
  updateBalance,
  getUserBalance,
  updateBalanceByEmail,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Existing routes
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/change-password", changePassword);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);

// Add balance route
router.post("/add-balance", addBalance);
router.put("/users/:userId/balance", updateBalance);
router.get("/users/:userId/balance", getUserBalance);
router.post("/users/balance/update", updateBalanceByEmail);

export default router;
