import express from "express";
import {
  placeOrder,
  getOrdersByUser,
  getAllOrders,
  confirmOrder,
  deliverOrder,
  cancelOrder,
} from "../controllers/orders.controller.js";

const router = express.Router();

console.log(" >> Orders routes file loaded");

// GET orders by user - MUST be before /:orderId
router.get(
  "/user/:userId",
  (req, res, next) => {
    console.log("👤 Fetching orders for user:", req.params.userId);
    next();
  },
  getOrdersByUser
);

// POST new order
router.post("/", placeOrder);

// GET all orders
router.get("/", getAllOrders);

// Order status updates
router.put("/:orderId/confirm", confirmOrder);
router.put("/:orderId/deliver", deliverOrder);
router.put("/:orderId/cancel", cancelOrder);

console.log(" >> Orders routes configured");

export default router;
