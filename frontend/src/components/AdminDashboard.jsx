import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminOrders from "./AdminOrders";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [activeSection, setActiveSection] = useState("overview");
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemType, setNewItemType] = useState("menu");
  const [newItemImage, setNewItemImage] = useState(null);
  const [adminStatus, setAdminStatus] = useState({ type: "", message: "" });
  const [adminItems, setAdminItems] = useState([]);
  const [sales, setSales] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [orders, setOrders] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogContent, setNewBlogContent] = useState("");
  const [newBlogImage, setNewBlogImage] = useState(null);

  useEffect(() => {
    const storedRequests =
      JSON.parse(localStorage.getItem("balanceRequests")) || [];
    setRequests(storedRequests);

    const storedAdminItems =
      JSON.parse(localStorage.getItem("adminItems")) || [];
    setAdminItems(storedAdminItems);

    const storedSales = JSON.parse(localStorage.getItem("sales")) || [];
    setSales(storedSales);

    const earnings = storedSales.reduce((sum, sale) => sum + sale.total, 0);
    setTotalEarnings(earnings);

    const storedBlogs = JSON.parse(localStorage.getItem("adminBlogs")) || [];
    setBlogs(storedBlogs);

    fetchOrders();
  }, []);

  const handleAddBlog = () => {
    if (!newBlogTitle || !newBlogContent) {
      setAdminStatus({
        type: "error",
        message: "Please provide a title and content for the blog.",
      });
      return;
    }

    const updatedBlogs = [
      ...blogs,
      {
        id: Date.now(),
        title: newBlogTitle,
        content: newBlogContent,
        imageUrl: newBlogImage || null,
        createdAt: new Date().toISOString(),
      },
    ];

    setBlogs(updatedBlogs);
    localStorage.setItem("adminBlogs", JSON.stringify(updatedBlogs));

    setNewBlogTitle("");
    setNewBlogContent("");
    setNewBlogImage(null);
    setAdminStatus({
      type: "success",
      message: "Blog added successfully.",
    });
  };

  const handleDeleteBlog = (id) => {
    const updated = blogs.filter((blog) => blog.id !== id);
    setBlogs(updated);
    localStorage.setItem("adminBlogs", JSON.stringify(updated));
    setAdminStatus({
      type: "success",
      message: "Blog removed successfully.",
    });
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/orders");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched orders:", data); // Debug log

      if (data.success && data.orders) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;
  const uniqueUsers = Array.from(new Set(requests.map((r) => r.userId))).length;
  const totalItemsSold = sales.reduce((sum, sale) => sum + sale.quantity, 0);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const completedOrders = orders.filter((o) => o.status === "delivered").length;
  const totalOrdersEarnings = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, order) => sum + order.total, 0);

  const handleApprove = async (id) => {
    const request = requests.find((req) => req.id === id);
    if (!request) return;

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/users/balance/update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: request.userId,
            amount: Number(request.amount || 0),
            operation: "add",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        throw new Error(
          errorData.message || "Failed to update balance in backend"
        );
      }

      const result = await response.json();
      console.log("Balance updated in backend:", result);

      const updatedRequests = requests.map((req) =>
        req.id === id ? { ...req, status: "approved" } : req
      );
      setRequests(updatedRequests);
      localStorage.setItem("balanceRequests", JSON.stringify(updatedRequests));

      const balances = JSON.parse(localStorage.getItem("userBalances")) || {};
      balances[request.userId] = result.balance;
      localStorage.setItem("userBalances", JSON.stringify(balances));

      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser && currentUser.email === request.userId) {
        const updatedUser = {
          ...currentUser,
          balance: result.balance,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      setAdminStatus({
        type: "success",
        message: "Request approved and balance updated in database.",
      });
    } catch (error) {
      console.error("Error approving balance request:", error);
      setAdminStatus({
        type: "error",
        message: "Failed to update balance: " + error.message,
      });
    }
  };

  const handleReject = (id) => {
    const updatedRequests = requests.map((req) =>
      req.id === id ? { ...req, status: "rejected" } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem("balanceRequests", JSON.stringify(updatedRequests));
    setAdminStatus({
      type: "success",
      message: "Request rejected.",
    });
  };

  const handleAddItem = () => {
    const price = parseFloat(newItemPrice);
    if (!newItemName || isNaN(price) || price <= 0) {
      setAdminStatus({
        type: "error",
        message: "Please provide a valid name and positive price.",
      });
      return;
    }

    const updatedAdminItems = [
      ...adminItems,
      {
        id: Date.now(),
        name: newItemName,
        price,
        type: newItemType,
        imageUrl: newItemImage || null,
      },
    ];

    setAdminItems(updatedAdminItems);
    localStorage.setItem("adminItems", JSON.stringify(updatedAdminItems));

    setNewItemName("");
    setNewItemPrice("");
    setNewItemImage(null);
    setAdminStatus({
      type: "success",
      message: "Item added successfully. It will appear on the site list.",
    });
  };

  const handleDeleteItem = (id) => {
    const updated = adminItems.filter((item) => item.id !== id);
    setAdminItems(updated);
    localStorage.setItem("adminItems", JSON.stringify(updated));
    setAdminStatus({
      type: "success",
      message: "Item removed successfully.",
    });
  };

  const handleSellItem = (itemId) => {
    const item = adminItems.find((i) => i.id === itemId);
    if (!item) return;

    const quantity = 1;
    const total = item.price * quantity;

    const newSale = {
      id: Date.now(),
      itemId,
      itemName: item.name,
      quantity,
      total,
      date: new Date().toISOString(),
    };

    const updatedSales = [...sales, newSale];
    setSales(updatedSales);
    localStorage.setItem("sales", JSON.stringify(updatedSales));

    const newEarnings = totalEarnings + total;
    setTotalEarnings(newEarnings);

    setAdminStatus({
      type: "success",
      message: `Sold ${item.name} for PKR ${total.toFixed(2)}.`,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin-login");
  };

  return (
    <div className="modern-account-page">
      {/* Sidebar */}
      <div className="modern-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-logo">Admin</h2>
          <p className="sidebar-subtitle">Dashboard</p>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`sidebar-nav-item ${
              activeSection === "overview" ? "active" : ""
            }`}
            onClick={() => setActiveSection("overview")}
          >
            <span className="nav-icon">📊</span>
            Overview
          </button>
          <button
            className={`sidebar-nav-item ${
              activeSection === "requests" ? "active" : ""
            }`}
            onClick={() => setActiveSection("requests")}
          >
            <span className="nav-icon">💰</span>
            Balance Requests
          </button>
          <button
            className={`sidebar-nav-item ${
              activeSection === "content" ? "active" : ""
            }`}
            onClick={() => setActiveSection("content")}
          >
            <span className="nav-icon">📝</span>
            Manage Content
          </button>
          <button
            className={`sidebar-nav-item ${
              activeSection === "orders" ? "active" : ""
            }`}
            onClick={() => setActiveSection("orders")}
          >
            <span className="nav-icon">📦</span>
            Orders
          </button>
          <button
            className={`sidebar-nav-item ${
              activeSection === "blogs" ? "active" : ""
            }`}
            onClick={() => setActiveSection("blogs")}
          >
            <span className="nav-icon">📖</span>
            Manage Blogs
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="modern-main-content">
        {/* Header */}
        <div className="modern-header">
          <div>
            <h1 className="modern-page-title">
              {activeSection === "overview" && "Dashboard Overview"}
              {activeSection === "requests" && "Balance Requests"}
              {activeSection === "content" && "Manage Content"}
              {activeSection === "orders" && "Orders Management"}
              {activeSection === "blogs" && "Manage Blogs"}
            </h1>
            <p className="modern-page-subtitle">
              {activeSection === "overview" &&
                "Monitor key metrics and quick actions"}
              {activeSection === "requests" &&
                "Approve or reject balance requests"}
              {activeSection === "content" &&
                "Add or remove menu and product items"}
              {activeSection === "orders" && "View and manage all user orders"}
              {activeSection === "blogs" && "Add or remove blog posts"}
            </p>
          </div>
          <div className="modern-user-badge">
            <div className="user-badge-avatar">
              <span>👤</span>
            </div>
            <div className="user-badge-info">
              <p className="user-badge-name">Admin</p>
              <p className="user-badge-email">admin@campuseats.com</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="modern-content-area">
          {/* Overview Stats */}
          {activeSection === "overview" && (
            <div className="admin-stats">
              <div className="admin-stat-card">
                <h4>Total Orders</h4>
                <p>{totalOrders}</p>
              </div>
              <div className="admin-stat-card">
                <h4>Completed Orders</h4>
                <p>{completedOrders}</p>
              </div>
              <div className="admin-stat-card">
                <h4>Total Items</h4>
                <p>{adminItems.length}</p>
              </div>
              <div className="admin-stat-card">
                <h4>Balance Requests</h4>
                <p>{requests.length}</p>
              </div>
              <div className="admin-stat-card">
                <h4>Total Revenue</h4>
                <p>PKR {totalOrdersEarnings.toFixed(2)}</p>
              </div>
            </div>
          )}
          {/* Balance Requests Stats */}
          {activeSection === "requests" && (
            <div className="admin-stats">
              <div className="admin-stat-card">
                <h4>Total Requests</h4>
                <p>{requests.length}</p>
              </div>
              <div className="admin-stat-card">
                <h4>Pending</h4>
                <p>{pendingCount}</p>
              </div>
              <div className="admin-stat-card">
                <h4>Approved</h4>
                <p>{approvedCount}</p>
              </div>
              <div className="admin-stat-card">
                <h4>Rejected</h4>
                <p>{rejectedCount}</p>
              </div>
            </div>
          )}
          {adminStatus.message && (
            <div
              className={`modern-alert ${
                adminStatus.type === "success" ? "alert-success" : "alert-error"
              }`}
            >
              {adminStatus.message}
            </div>
          )}
          {/* Overview section */}
          {activeSection === "overview" && (
            <div className="content-section">
              <div className="modern-card">
                <h3 className="card-title">Quick Actions</h3>
                <div className="modern-form">
                  <button
                    className="modern-btn modern-btn-primary"
                    onClick={() => navigate("/home")}
                  >
                    View Site as User
                  </button>
                  <button
                    className="modern-btn modern-btn-secondary"
                    onClick={() => navigate("/admin-reviews")}
                  >
                    View Reviews
                  </button>
                  <button
                    className="modern-btn modern-btn-secondary"
                    onClick={() => navigate("/admin-blogs")}
                  >
                    View Blogs
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Balance requests section */}
          {activeSection === "requests" && (
            <div className="content-section">
              {/* Pending Approvals */}
              <div className="modern-card">
                <h3 className="card-title">Pending Approvals</h3>
                {requests.filter((req) => req.status === "pending").length ===
                0 ? (
                  <p className="no-data">No pending requests.</p>
                ) : (
                  <div className="request-history-table">
                    <div className="table-header">
                      <div className="table-cell">User</div>
                      <div className="table-cell">Amount</div>
                      <div className="table-cell">Requested</div>
                      <div className="table-cell">Actions</div>
                    </div>
                    {requests
                      .filter((req) => req.status === "pending")
                      .map((req) => (
                        <div key={req.id} className="table-row">
                          <div className="table-cell" data-label="User:">
                            {req.userId}
                          </div>
                          <div className="table-cell" data-label="Amount:">
                            PKR {Number(req.amount || 0).toFixed(2)}
                          </div>
                          <div className="table-cell" data-label="Requested:">
                            {new Date(req.requestedAt).toLocaleString()}
                          </div>
                          <div
                            className="table-cell actions-cell"
                            data-label="Actions:"
                          >
                            <button
                              className="modern-btn modern-btn-primary"
                              onClick={() => handleApprove(req.id)}
                            >
                              Approve
                            </button>
                            <button
                              className="modern-btn modern-btn-secondary"
                              onClick={() => handleReject(req.id)}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Request History */}
              <div className="modern-card">
                <h3 className="card-title">Request History</h3>
                {requests.filter((req) => req.status !== "pending").length ===
                0 ? (
                  <p className="no-data">No history yet.</p>
                ) : (
                  <div className="request-history-table">
                    <div className="table-header">
                      <div className="table-cell">User</div>
                      <div className="table-cell">Amount</div>
                      <div className="table-cell">Status</div>
                      <div className="table-cell">Processed</div>
                    </div>
                    {requests
                      .filter((req) => req.status !== "pending")
                      .map((req) => (
                        <div key={req.id} className="table-row">
                          <div className="table-cell" data-label="User:">
                            {req.userId}
                          </div>
                          <div className="table-cell" data-label="Amount:">
                            PKR {Number(req.amount || 0).toFixed(2)}
                          </div>
                          <div className="table-cell" data-label="Status:">
                            <span className={`status-badge ${req.status}`}>
                              {req.status}
                            </span>
                          </div>
                          <div className="table-cell" data-label="Processed:">
                            {new Date(req.requestedAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Content management section */}
          {activeSection === "content" && (
            <div className="content-section">
              <div className="modern-card">
                <h3 className="card-title">Add New Item</h3>
                <div className="modern-form">
                  <div className="form-group">
                    <label className="form-label">Item Name</label>
                    <input
                      type="text"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder="Enter item name"
                      className="modern-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price (PKR)</label>
                    <input
                      type="number"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      placeholder="Enter price"
                      min="0"
                      step="0.01"
                      className="modern-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <select
                      value={newItemType}
                      onChange={(e) => setNewItemType(e.target.value)}
                      className="modern-input"
                    >
                      <option value="menu">Menu Item</option>
                      <option value="product">Product</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Image (Optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setNewItemImage(ev.target?.result || null);
                          };
                          reader.readAsDataURL(file);
                        } else {
                          setNewItemImage(null);
                        }
                      }}
                      className="modern-input"
                    />
                  </div>
                  <button
                    className="modern-btn modern-btn-primary"
                    onClick={handleAddItem}
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Orders section */}
          {activeSection === "orders" && (
            <div className="content-section">
              <AdminOrders />
            </div>
          )}
          // {/* Blogs section */}
          {activeSection === "blogs" && (
            <div className="content-section">
              <div className="modern-card">
                <h3 className="card-title">Add New Blog</h3>
                <div className="modern-form">
                  <div className="form-group">
                    <label className="form-label">Blog Title</label>
                    <input
                      type="text"
                      value={newBlogTitle}
                      onChange={(e) => setNewBlogTitle(e.target.value)}
                      placeholder="Enter blog title"
                      className="modern-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Content</label>
                    <textarea
                      value={newBlogContent}
                      onChange={(e) => setNewBlogContent(e.target.value)}
                      placeholder="Enter blog content"
                      className="modern-input"
                      rows="5"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Image (Optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setNewBlogImage(ev.target?.result || null);
                          };
                          reader.readAsDataURL(file);
                        } else {
                          setNewBlogImage(null);
                        }
                      }}
                      className="modern-input"
                    />
                  </div>
                  <button
                    className="modern-btn modern-btn-primary"
                    onClick={handleAddBlog}
                  >
                    Add Blog
                  </button>
                </div>
              </div>

              <div className="modern-card">
                <h3 className="card-title">Existing Blogs</h3>
                {blogs.length === 0 ? (
                  <p className="no-data">No blogs yet.</p>
                ) : (
                  <div className="request-history-table">
                    <div className="table-header">
                      <div className="table-cell">Title</div>
                      <div className="table-cell">Created</div>
                      <div className="table-cell">Actions</div>
                    </div>
                    {blogs.map((blog) => (
                      <div key={blog.id} className="table-row">
                        <div className="table-cell" data-label="Title:">
                          {blog.title}
                        </div>
                        <div className="table-cell" data-label="Created:">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </div>
                        <div
                          className="table-cell actions-cell"
                          data-label="Actions:"
                        >
                          <button
                            className="modern-btn modern-btn-secondary"
                            onClick={() => handleDeleteBlog(blog.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
