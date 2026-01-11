// orders.controller.js - Complete this file in your controllers folder

import Order from "../models/Order.js";
import User from "../models/User.js";

// Place a new order
export const placeOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      userPhone,
      items,
      total,
      deliveryAddress,
      paymentMethod,
    } = req.body;

    // Validate required fields
    if (!userId || !items || !total || !deliveryAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // If paying with balance, check and deduct
    if (paymentMethod === "balance") {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (user.balance < total) {
        return res.status(400).json({
          success: false,
          message: "Insufficient balance",
        });
      }

      // Deduct balance
      user.balance -= total;
      await user.save();
    }

    // Create new order
    const newOrder = new Order({
      user: userId,
      userName,
      userEmail,
      userPhone,
      items,
      total,
      deliveryAddress,
      paymentMethod,
      status: "pending",
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to place order",
    });
  }
};

// Get all orders (for admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

// Get orders by user
export const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

// Confirm order (admin)
export const confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: "confirmed" },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order confirmed",
      order,
    });
  } catch (error) {
    console.error("Error confirming order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to confirm order",
    });
  }
};

// Mark order as delivered (admin)
export const deliverOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: "delivered" },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order marked as delivered",
      order,
    });
  } catch (error) {
    console.error("Error delivering order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order",
    });
  }
};

// Cancel order (user)
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be cancelled",
      });
    }

    // If paid with balance, refund
    if (order.paymentMethod === "balance") {
      const user = await User.findById(order.user);
      if (user) {
        user.balance += order.total;
        await user.save();
      }
    }

    order.status = "cancelled";
    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
    });
  }
};
