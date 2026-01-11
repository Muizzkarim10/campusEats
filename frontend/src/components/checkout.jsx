import React, { useState, useEffect } from "react";
import { useCart } from "./cartContext";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  ShoppingBag,
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
} from "lucide-react";

import "../styles/checkout.css";

const Checkout = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const getUserData = async () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsed = JSON.parse(userData);
        const balances = JSON.parse(localStorage.getItem("userBalances")) || {};
        const email = parsed.email;
        let effectiveBalance = email ? Number(balances[email] || 0) : 0;

        const userId = parsed.id || parsed._id;
        if (userId) {
          try {
            const response = await fetch(
              `http://localhost:5000/api/auth/users/${userId}/balance`
            );
            if (response.ok) {
              const data = await response.json();
              if (data.success && typeof data.balance === "number") {
                effectiveBalance = data.balance;
                balances[email] = effectiveBalance;
                localStorage.setItem("userBalances", JSON.stringify(balances));
              }
            }
          } catch (error) {
            console.error("Error fetching backend balance:", error);
          }
        }

        return {
          name: parsed.name || "",
          email: parsed.email || "",
          phone: parsed.phone || "",
          address: parsed.address || "",
          city: parsed.city || "",
          zipCode: parsed.zipCode || "",
          balance: effectiveBalance,
        };
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
    return {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      zipCode: "",
      balance: 0,
    };
  };

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    balance: 0,
  });

  useEffect(() => {
    const loadUser = async () => {
      const userData = await getUserData();
      setUser(userData);
    };
    loadUser();
  }, []);

  const [formData, setFormData] = useState({
    fullName: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
    city: user.city || "",
    zipCode: user.zipCode || "",
    paymentMethod: "card",
  });

  const [checkoutStatus, setCheckoutStatus] = useState({
    type: "",
    message: "",
  });
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      fullName: user.name || prev.fullName,
      email: user.email || prev.email,
      phone: user.phone || prev.phone,
      address: user.address || prev.address,
      city: user.city || prev.city,
      zipCode: user.zipCode || prev.zipCode,
    }));
  }, [user]);

  const subtotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 1;
    return sum + price * quantity;
  }, 0);
  const tax = subtotal * 0.1;
  const deliveryFee = cart.length > 0 ? 5 : 0;
  const total = subtotal + tax + deliveryFee;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (isProcessing) return;

    setIsProcessing(true);
    setCheckoutStatus({ type: "", message: "" });

    if (cart.length === 0) {
      setCheckoutStatus({
        type: "error",
        message: "Your cart is empty.",
      });
      setIsProcessing(false);
      return;
    }

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.address
    ) {
      setCheckoutStatus({
        type: "error",
        message: "Please fill in all required fields.",
      });
      setIsProcessing(false);
      return;
    }

    if (formData.paymentMethod === "balance") {
      const freshUserData = await getUserData();
      const userBalance = Number(freshUserData.balance) || 0;

      if (userBalance < total) {
        setCheckoutStatus({
          type: "error",
          message: `Insufficient balance! You have PKR ${userBalance.toFixed(
            2
          )} but need PKR ${total.toFixed(2)}.`,
        });
        setShowPopup(true);
        setIsProcessing(false);
        return;
      }

      setUser(freshUserData);
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = storedUser.id || storedUser._id;

      // Place order with PENDING status
      const items = cart.map((item) => ({
        name: item.name,
        price: parseFloat(item.price) || 0,
        quantity: parseInt(item.quantity) || 1,
      }));

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          userName: formData.fullName,
          userEmail: formData.email,
          userPhone: formData.phone,
          deliveryAddress: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          items,
          total,
          paymentMethod: formData.paymentMethod,
          status: "pending", // Order starts as pending
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setCheckoutStatus({
          type: "error",
          message: data?.message || "Failed to place order.",
        });
        setShowPopup(true);
        setIsProcessing(false);
        return;
      }

      setCheckoutStatus({
        type: "success",
        message: `Order placed successfully! Your order is pending admin confirmation.`,
      });
      setShowPopup(true);
      clearCart();
      setIsProcessing(false);
    } catch (err) {
      console.error("Checkout error:", err);
      setCheckoutStatus({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
      setShowPopup(true);
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-container">
      {showPopup && (
        <div
          className="popup-overlay"
          onClick={() => {
            if (checkoutStatus.type === "success") {
              setShowPopup(false);
              navigate("/my-orders");
            } else {
              setShowPopup(false);
            }
          }}
        >
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div
              className={`popup-icon ${
                checkoutStatus.type === "success"
                  ? "success-icon"
                  : "error-icon"
              }`}
            >
              {checkoutStatus.type === "success" ? (
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              ) : (
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              )}
            </div>
            <h3 className="popup-title">
              {checkoutStatus.type === "success"
                ? "🎉 Order Submitted!"
                : "⚠️ Order Failed"}
            </h3>
            <p className="popup-message">{checkoutStatus.message}</p>
            {checkoutStatus.type === "success" && (
              <div className="success-details">
                <p className="delivery-info">
                  ⏳ Waiting for admin confirmation
                </p>
                <p className="delivery-info">
                  📱 You can cancel before confirmation
                </p>
              </div>
            )}
            <button
              className="popup-btn"
              onClick={() => {
                if (checkoutStatus.type === "success") {
                  setShowPopup(false);
                  navigate("/my-orders");
                } else {
                  setShowPopup(false);
                }
              }}
            >
              {checkoutStatus.type === "success"
                ? "📋 View My Orders"
                : "Close"}
            </button>
          </div>
        </div>
      )}

      <div className="checkout-header">
        <h1 className="checkout-title">
          <ShoppingBag size={40} />
          Checkout
        </h1>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button className="btn" onClick={() => navigate("/menu")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="checkout-content">
          <div className="checkout-form-section">
            <h2>Delivery Information</h2>
            <div onSubmit={handlePlaceOrder}>
              <div className="form-group">
                <label className="form-label">
                  <User size={18} />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Mail size={18} />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Phone size={18} />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <MapPin size={18} />
                  Delivery Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="form-textarea"
                  placeholder="Enter your delivery address"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="City"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Zip Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Zip code"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <CreditCard size={18} />
                  Payment Method *
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="cash">Cash on Delivery</option>
                  <option value="balance">
                    Pay with Balance (PKR {(user.balance || 0).toFixed(2)})
                  </option>
                </select>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="submit-btn"
                disabled={isProcessing}
              >
                {isProcessing
                  ? "Processing..."
                  : `Place Order - PKR ${total.toFixed(2)}`}
              </button>
            </div>
          </div>

          <div className="order-summary-section">
            <h2>Order Summary</h2>
            <div className="summary-content">
              <div className="cart-items-list">
                {cart.map((item, index) => (
                  <div key={index} className="cart-item-row">
                    <div className="cart-item-info">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="cart-item-image"
                      />
                      <div className="cart-item-details">
                        <h4>{item.name}</h4>
                        <p>
                          PKR {parseFloat(item.price).toFixed(2)} x{" "}
                          {item.quantity || 1}
                        </p>
                        <p className="item-total">
                          Total: PKR{" "}
                          {(
                            parseFloat(item.price) * (item.quantity || 1)
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="remove-item-btn"
                      type="button"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="price-breakdown">
                <div className="price-row">
                  <span>Subtotal:</span>
                  <span>PKR {subtotal.toFixed(2)}</span>
                </div>
                <div className="price-row">
                  <span>Tax (10%):</span>
                  <span>PKR {tax.toFixed(2)}</span>
                </div>
                <div className="price-row">
                  <span>Delivery Fee:</span>
                  <span>PKR {deliveryFee.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Total:</span>
                  <span>PKR {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
