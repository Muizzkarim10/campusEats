import React, { useState, useEffect } from "react";
import {
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalEarnings: 0,
  });
  const [filter, setFilter] = useState("all");
  const [processingOrderId, setProcessingOrderId] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: "", message: "" });
  const [confirmPopup, setConfirmPopup] = useState({
    show: false,
    orderId: null,
    type: "",
    message: "",
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/orders");
      const data = await response.json();

      if (response.ok) {
        const allOrders = data.orders || [];
        setOrders(allOrders);
        calculateStats(allOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setStatusMessage({
        type: "error",
        message: "Failed to load orders. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (allOrders) => {
    const totalOrders = allOrders.length;
    const pendingOrders = allOrders.filter(
      (o) => o.status === "pending"
    ).length;
    const completedOrders = allOrders.filter(
      (o) => o.status === "delivered"
    ).length;
    const totalEarnings = allOrders
      .filter((o) => o.status === "delivered")
      .reduce((sum, order) => sum + order.total, 0);

    setStats({
      totalOrders,
      pendingOrders,
      completedOrders,
      totalEarnings,
    });
  };

  const showConfirmation = (orderId, type) => {
    const messages = {
      confirm: "Are you sure you want to confirm this order?",
      deliver: "Are you sure you want to mark this order as delivered?",
    };

    setConfirmPopup({
      show: true,
      orderId,
      type,
      message: messages[type],
    });
  };

  const handleConfirmAction = async () => {
    const { orderId, type } = confirmPopup;
    setConfirmPopup({ show: false, orderId: null, type: "", message: "" });
    setProcessingOrderId(orderId);
    setStatusMessage({ type: "", message: "" });

    const endpoint =
      type === "confirm"
        ? `http://localhost:5000/api/orders/${orderId}/confirm`
        : `http://localhost:5000/api/orders/${orderId}/deliver`;

    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        fetchOrders();
        setStatusMessage({
          type: "success",
          message:
            type === "confirm"
              ? "Order confirmed successfully!"
              : "Order marked as delivered!",
        });
      } else {
        const data = await response.json();
        setStatusMessage({
          type: "error",
          message: data.message || "Failed to update order",
        });
      }
    } catch (error) {
      console.error("Error updating order:", error);
      setStatusMessage({
        type: "error",
        message: "Failed to update order. Please try again.",
      });
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handleCancelAction = () => {
    setConfirmPopup({ show: false, orderId: null, type: "", message: "" });
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  // Separate pending/confirmed from delivered/cancelled
  const actionableOrders = filteredOrders.filter(
    (o) => o.status === "pending" || o.status === "confirmed"
  );
  const completedOrders = filteredOrders.filter(
    (o) => o.status === "delivered" || o.status === "cancelled"
  );

  if (loading) {
    return (
      <div className="modern-card">
        <p style={{ textAlign: "center", color: "#999", fontSize: "1.5rem" }}>
          Loading orders...
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Confirmation Popup */}
      {confirmPopup.show && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div
              className="popup-icon"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 193, 7, 0.15), rgba(255, 152, 0, 0.15))",
                border: "2px solid rgba(255, 193, 7, 0.3)",
              }}
            >
              <AlertCircle size={48} style={{ color: "#ffc107" }} />
            </div>
            <h2 className="popup-title">Confirm Action</h2>
            <p className="popup-message">{confirmPopup.message}</p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                marginTop: "2rem",
              }}
            >
              <button
                className="popup-btn"
                onClick={handleConfirmAction}
                style={{
                  background: "linear-gradient(135deg, #ffc107, #ff9800)",
                }}
              >
                Yes, Confirm
              </button>
              <button
                className="popup-btn"
                onClick={handleCancelAction}
                style={{
                  background: "transparent",
                  border: "2px solid rgba(255, 193, 7, 0.5)",
                  color: "#ffc107",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        {/* Stats Grid */}
        <div className="admin-stats">
          <div className="admin-stat-card">
            <h4>
              <Package
                size={20}
                style={{ verticalAlign: "middle", marginRight: "0.5rem" }}
              />
              Total Orders
            </h4>
            <p>{stats.totalOrders}</p>
          </div>
          <div className="admin-stat-card">
            <h4>
              <Clock
                size={20}
                style={{ verticalAlign: "middle", marginRight: "0.5rem" }}
              />
              Pending
            </h4>
            <p>{stats.pendingOrders}</p>
          </div>
          <div className="admin-stat-card">
            <h4>
              <CheckCircle
                size={20}
                style={{ verticalAlign: "middle", marginRight: "0.5rem" }}
              />
              Completed
            </h4>
            <p>{stats.completedOrders}</p>
          </div>
          <div className="admin-stat-card">
            <h4>
              <DollarSign
                size={20}
                style={{ verticalAlign: "middle", marginRight: "0.5rem" }}
              />
              Earnings
            </h4>
            <p>PKR {stats.totalEarnings.toFixed(2)}</p>
          </div>
        </div>

        {/* Status Message */}
        {statusMessage.message && (
          <div
            className={`modern-alert ${
              statusMessage.type === "success" ? "alert-success" : "alert-error"
            }`}
          >
            {statusMessage.message}
          </div>
        )}

        {/* Filter Buttons */}
        <div className="modern-card">
          <h3 className="card-title">Filter Orders</h3>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button
              className={`modern-btn ${
                filter === "all" ? "modern-btn-primary" : "modern-btn-secondary"
              }`}
              onClick={() => setFilter("all")}
            >
              All Orders
            </button>
            <button
              className={`modern-btn ${
                filter === "pending"
                  ? "modern-btn-primary"
                  : "modern-btn-secondary"
              }`}
              onClick={() => setFilter("pending")}
            >
              Pending
            </button>
            <button
              className={`modern-btn ${
                filter === "confirmed"
                  ? "modern-btn-primary"
                  : "modern-btn-secondary"
              }`}
              onClick={() => setFilter("confirmed")}
            >
              Confirmed
            </button>
            <button
              className={`modern-btn ${
                filter === "delivered"
                  ? "modern-btn-primary"
                  : "modern-btn-secondary"
              }`}
              onClick={() => setFilter("delivered")}
            >
              Delivered
            </button>
            <button
              className={`modern-btn ${
                filter === "cancelled"
                  ? "modern-btn-primary"
                  : "modern-btn-secondary"
              }`}
              onClick={() => setFilter("cancelled")}
            >
              Cancelled
            </button>
          </div>
        </div>

        {/* Actionable Orders - Full Cards */}
        {actionableOrders.length > 0 && (
          <div className="modern-card">
            <h3 className="card-title">Active Orders</h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {actionableOrders.map((order) => (
                <div
                  key={order._id}
                  style={{
                    background: "rgba(10, 10, 15, 0.8)",
                    border: "2px solid rgba(255, 193, 7, 0.2)",
                    borderRadius: "1rem",
                    padding: "2rem",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255, 193, 7, 0.4)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255, 193, 7, 0.2)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* Order Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1.5rem",
                      flexWrap: "wrap",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          color: "#ffc107",
                          fontSize: "1.8rem",
                          margin: "0 0 0.5rem 0",
                        }}
                      >
                        Order #{order._id.slice(-8)}
                      </h4>
                      <p
                        style={{ color: "#999", fontSize: "1.3rem", margin: 0 }}
                      >
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span
                      style={{
                        padding: "0.5rem 1.5rem",
                        borderRadius: "2rem",
                        fontSize: "1.3rem",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        background:
                          order.status === "pending"
                            ? "rgba(255, 193, 7, 0.15)"
                            : "rgba(76, 175, 80, 0.15)",
                        color:
                          order.status === "pending" ? "#ffc107" : "#4caf50",
                        border:
                          order.status === "pending"
                            ? "2px solid rgba(255, 193, 7, 0.3)"
                            : "2px solid rgba(76, 175, 80, 0.3)",
                      }}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div
                    style={{
                      marginBottom: "1.5rem",
                      padding: "1.5rem",
                      background: "rgba(255, 193, 7, 0.05)",
                      borderRadius: "0.8rem",
                      border: "1px solid rgba(255, 193, 7, 0.1)",
                    }}
                  >
                    <h5
                      style={{
                        color: "#ffc107",
                        fontSize: "1.5rem",
                        marginBottom: "0.8rem",
                      }}
                    >
                      Customer Details
                    </h5>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "0.8rem",
                      }}
                    >
                      <p
                        style={{ color: "#fff", fontSize: "1.3rem", margin: 0 }}
                      >
                        <strong>Name:</strong> {order.userName}
                      </p>
                      <p
                        style={{ color: "#fff", fontSize: "1.3rem", margin: 0 }}
                      >
                        <strong>Email:</strong> {order.userEmail}
                      </p>
                      <p
                        style={{ color: "#fff", fontSize: "1.3rem", margin: 0 }}
                      >
                        <strong>Phone:</strong> {order.userPhone}
                      </p>
                      <p
                        style={{ color: "#fff", fontSize: "1.3rem", margin: 0 }}
                      >
                        <strong>Address:</strong> {order.deliveryAddress}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <h5
                      style={{
                        color: "#ffc107",
                        fontSize: "1.5rem",
                        marginBottom: "1rem",
                      }}
                    >
                      Order Items
                    </h5>
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "0.8rem 0",
                          borderBottom:
                            idx < order.items.length - 1
                              ? "1px solid rgba(255, 255, 255, 0.1)"
                              : "none",
                        }}
                      >
                        <span style={{ color: "#fff", fontSize: "1.3rem" }}>
                          {item.name} x {item.quantity}
                        </span>
                        <span
                          style={{
                            color: "#ffc107",
                            fontSize: "1.3rem",
                            fontWeight: "600",
                          }}
                        >
                          PKR {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: "1.5rem",
                      borderTop: "2px solid rgba(255, 193, 7, 0.2)",
                      flexWrap: "wrap",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          color: "#999",
                          fontSize: "1.2rem",
                          margin: "0 0 0.3rem 0",
                        }}
                      >
                        Payment Method
                      </p>
                      <p
                        style={{
                          color: "#fff",
                          fontSize: "1.4rem",
                          fontWeight: "600",
                          margin: 0,
                        }}
                      >
                        {order.paymentMethod === "card"
                          ? "Credit/Debit Card"
                          : order.paymentMethod === "cash"
                          ? "Cash on Delivery"
                          : "Balance"}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p
                        style={{
                          color: "#999",
                          fontSize: "1.2rem",
                          margin: "0 0 0.3rem 0",
                        }}
                      >
                        Total Amount
                      </p>
                      <p
                        style={{
                          color: "#ffc107",
                          fontSize: "1.8rem",
                          fontWeight: "700",
                          margin: 0,
                        }}
                      >
                        PKR {order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      marginTop: "1.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {order.status === "pending" && (
                      <button
                        className="modern-btn modern-btn-primary"
                        onClick={() => showConfirmation(order._id, "confirm")}
                        disabled={processingOrderId === order._id}
                        style={{ flex: "1", minWidth: "150px" }}
                      >
                        {processingOrderId === order._id
                          ? "Processing..."
                          : "Confirm Order"}
                      </button>
                    )}
                    {order.status === "confirmed" && (
                      <button
                        className="modern-btn modern-btn-primary"
                        onClick={() => showConfirmation(order._id, "deliver")}
                        disabled={processingOrderId === order._id}
                        style={{ flex: "1", minWidth: "150px" }}
                      >
                        {processingOrderId === order._id
                          ? "Processing..."
                          : "Mark as Delivered"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Orders - Table View */}
        {completedOrders.length > 0 && (
          <div className="modern-card">
            <h3 className="card-title">Order History</h3>
            <div className="request-history-table">
              <div className="table-header">
                <div className="table-cell">Order ID</div>
                <div className="table-cell">Customer</div>
                <div className="table-cell">Items</div>
                <div className="table-cell">Total</div>
                <div className="table-cell">Status</div>
                <div className="table-cell">Date</div>
              </div>
              {completedOrders.map((order) => (
                <div key={order._id} className="table-row">
                  <div className="table-cell" data-label="Order ID:">
                    #{order._id.slice(-8)}
                  </div>
                  <div className="table-cell" data-label="Customer:">
                    {order.userName}
                  </div>
                  <div className="table-cell" data-label="Items:">
                    {order.items.length} item(s)
                  </div>
                  <div className="table-cell" data-label="Total:">
                    PKR {order.total.toFixed(2)}
                  </div>
                  <div className="table-cell" data-label="Status:">
                    <span className={`status-badge ${order.status}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="table-cell" data-label="Date:">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Orders Message */}
        {filteredOrders.length === 0 && (
          <div className="modern-card">
            <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
              <Package
                size={64}
                style={{ color: "#666", marginBottom: "1rem" }}
              />
              <p style={{ color: "#999", fontSize: "1.5rem" }}>
                No {filter !== "all" ? filter : ""} orders found
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminOrders;
