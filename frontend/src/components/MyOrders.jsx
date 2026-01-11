import React, { useState, useEffect } from "react";
import { Package, Clock, CheckCircle, XCircle, Truck } from "lucide-react";
import "../styles/checkout.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [confirmOrderId, setConfirmOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = userData.id || userData._id;

      if (!userId) {
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/orders/user/${userId}`
      );
      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = (orderId) => {
    setConfirmOrderId(orderId);
    setShowConfirmPopup(true);
  };

  const confirmCancelOrder = async () => {
    setShowConfirmPopup(false);
    const orderId = confirmOrderId;
    setConfirmOrderId(null);

    setCancellingOrderId(orderId);

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/cancel`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Refresh orders
        fetchOrders();
        setPopupType("success");
        setPopupMessage("Order cancelled successfully!");
        setShowPopup(true);
      } else {
        setPopupType("error");
        setPopupMessage(data.message || "Failed to cancel order");
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      setPopupType("error");
      setPopupMessage("Failed to cancel order. Please try again.");
      setShowPopup(true);
    } finally {
      setCancellingOrderId(null);
    }
  };

  const cancelConfirmPopup = () => {
    setShowConfirmPopup(false);
    setConfirmOrderId(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="status-icon pending" />;
      case "confirmed":
        return <CheckCircle className="status-icon confirmed" />;
      case "delivered":
        return <Truck className="status-icon delivered" />;
      case "cancelled":
        return <XCircle className="status-icon cancelled" />;
      default:
        return <Package className="status-icon" />;
    }
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`status-badge ${status}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>
          <Package size={36} />
          My Orders
        </h1>
        <p>Track and manage your orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <Package size={64} className="empty-icon" />
          <h2>No orders yet</h2>
          <p>Start ordering delicious food from our menu!</p>
          <button
            className="btn-primary"
            onClick={() => (window.location.href = "/menu")}
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header-row">
                <div className="order-info">
                  {getStatusIcon(order.status)}
                  <div>
                    <h3>Order #{order._id.slice(-8)}</h3>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                {getStatusBadge(order.status)}
              </div>

              <div className="order-details">
                <div className="order-items">
                  <h4>Items:</h4>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>PKR {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="order-delivery-info">
                  <p>
                    <strong>Delivery Address:</strong> {order.deliveryAddress}
                  </p>
                  <p>
                    <strong>Payment Method:</strong>{" "}
                    {order.paymentMethod === "card"
                      ? "Credit/Debit Card"
                      : order.paymentMethod === "cash"
                      ? "Cash on Delivery"
                      : "Balance"}
                  </p>
                </div>

                <div className="order-total">
                  <strong>Total:</strong>
                  <strong>PKR {order.total.toFixed(2)}</strong>
                </div>
              </div>

              {order.status === "pending" && (
                <div className="order-actions">
                  <button
                    className="btn-cancel"
                    onClick={() => handleCancelOrder(order._id)}
                    disabled={cancellingOrderId === order._id}
                  >
                    {cancellingOrderId === order._id
                      ? "Cancelling..."
                      : "Cancel Order"}
                  </button>
                </div>
              )}

              {order.status === "confirmed" && (
                <div className="order-status-message confirmed-message">
                  ✅ Your order has been confirmed and is being prepared!
                </div>
              )}

              {order.status === "delivered" && (
                <div className="order-status-message delivered-message">
                  🎉 Order delivered! Thank you for your order!
                </div>
              )}

              {order.status === "cancelled" && (
                <div className="order-status-message cancelled-message">
                  ❌ This order was cancelled
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showConfirmPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-icon error-icon">
              <XCircle size={48} />
            </div>
            <h2 className="popup-title">Confirm Cancellation</h2>
            <p className="popup-message">
              Are you sure you want to cancel this order?
            </p>
            <div
              style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
            >
              <button className="popup-btn" onClick={confirmCancelOrder}>
                Yes, Cancel
              </button>
              <button
                className="btn-cancel"
                onClick={cancelConfirmPopup}
                style={{ padding: "1.4rem 4rem" }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className={`popup-icon ${popupType}-icon`}>
              {popupType === "success" ? (
                <CheckCircle size={48} />
              ) : (
                <XCircle size={48} />
              )}
            </div>
            <h2 className="popup-title">
              {popupType === "success"
                ? "Order Cancelled"
                : "Cancellation Failed"}
            </h2>
            <p className="popup-message">{popupMessage}</p>
            <button className="popup-btn" onClick={() => setShowPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
