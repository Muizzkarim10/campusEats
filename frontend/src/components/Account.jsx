import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../services/authService";

const Account = ({ setShowNavbarFooter }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (setShowNavbarFooter) {
      setShowNavbarFooter(false);
    }
    return () => {
      if (setShowNavbarFooter) {
        setShowNavbarFooter(true);
      }
    };
  }, [setShowNavbarFooter]);

  const [user, setUser] = useState({
    name: "",
    email: "",
    balance: 0,
    profileImage: null,
  });
  const [addBalanceAmount, setAddBalanceAmount] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [accountStatus, setAccountStatus] = useState({
    type: "",
    message: "",
  });
  const [passwordStatus, setPasswordStatus] = useState({
    type: "",
    message: "",
  });
  const [activeSection, setActiveSection] = useState("profile");

  // Load user data
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {
      name: "Guest",
      email: "",
      balance: 0,
      profileImage: null,
    };

    // Get balance from userBalances store
    const balances = JSON.parse(localStorage.getItem("userBalances")) || {};
    const profileImages =
      JSON.parse(localStorage.getItem("userProfileImages")) || {};
    const email = storedUser.email;

    let effectiveBalance = email ? Number(balances[email] || 0) : 0;
    const storedProfileImage = email ? profileImages[email] || null : null;

    // Sync balance from backend
    if (storedUser.id || storedUser._id) {
      try {
        const userId = storedUser.id || storedUser._id;
        const response = await fetch(
          `http://localhost:5000/api/users/${userId}/balance`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.success && typeof data.balance === "number") {
            effectiveBalance = data.balance;
            // Update localStorage with backend balance
            balances[email] = effectiveBalance;
            localStorage.setItem("userBalances", JSON.stringify(balances));
            storedUser.balance = effectiveBalance;
            localStorage.setItem("user", JSON.stringify(storedUser));
            console.log("Balance synced from backend:", effectiveBalance);
          }
        }
      } catch (error) {
        console.error("Error fetching balance from backend:", error);
      }
    }

    setUser({
      ...storedUser,
      balance: effectiveBalance,
      profileImage: storedProfileImage || storedUser.profileImage || null,
    });

    if (storedProfileImage || storedUser.profileImage) {
      setImagePreview(storedProfileImage || storedUser.profileImage);
    }
  };

  const handleAddBalance = () => {
    const amount = parseFloat(addBalanceAmount);
    if (isNaN(amount) || amount <= 0) {
      setAccountStatus({
        type: "error",
        message: "Please enter a valid positive amount.",
      });
      return;
    }

    const request = {
      id: Date.now(),
      userId: user.email || "guest",
      amount,
      status: "pending",
      requestedAt: new Date().toISOString(),
    };

    const existingRequests =
      JSON.parse(localStorage.getItem("balanceRequests")) || [];
    existingRequests.push(request);
    localStorage.setItem("balanceRequests", JSON.stringify(existingRequests));

    setAddBalanceAmount("");
    setAccountStatus({
      type: "success",
      message: "Balance request submitted. Waiting for admin approval.",
    });
  };

  const handleChangePassword = async () => {
    if (!user.email) {
      setPasswordStatus({
        type: "error",
        message: "Please log in again before changing your password.",
      });
      return;
    }

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordStatus({
        type: "error",
        message: "Please fill in all password fields.",
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordStatus({
        type: "error",
        message: "New passwords do not match.",
      });
      return;
    }

    try {
      const payload = {
        email: user.email,
        currentPassword,
        newPassword,
      };

      const res = await changePassword(payload);
      console.log("Change password response:", res);

      if (res && res.success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setPasswordStatus({
          type: "success",
          message: res.message || "Password changed successfully.",
        });
      } else {
        setPasswordStatus({
          type: "error",
          message: res?.message || "Failed to change password.",
        });
      }
    } catch (err) {
      console.error("Change password error:", err);
      setPasswordStatus({
        type: "error",
        message: "Server error. Please try again.",
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setAccountStatus({
          type: "error",
          message: "Image size should be less than 5MB.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfileImage = () => {
    if (selectedImage) {
      const updatedUser = {
        ...user,
        profileImage: selectedImage,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (updatedUser.email) {
        const profileImages =
          JSON.parse(localStorage.getItem("userProfileImages")) || {};
        profileImages[updatedUser.email] = selectedImage;
        localStorage.setItem(
          "userProfileImages",
          JSON.stringify(profileImages)
        );
      }

      setSelectedImage(null);
      setAccountStatus({
        type: "success",
        message: "Profile image updated successfully!",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setAccountStatus({ type: "", message: "" });
    setPasswordStatus({ type: "", message: "" });
  };

  return (
    <div className="modern-account-page">
      {/* Sidebar */}
      <div className="modern-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-logo">Account</h2>
          <p className="sidebar-subtitle">Settings</p>
          <button
            className="modern-btn modern-btn-secondary sidebar-back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`sidebar-nav-item ${
              activeSection === "profile" ? "active" : ""
            }`}
            onClick={() => handleSectionChange("profile")}
          >
            <span className="nav-icon">👤</span>
            Profile
          </button>
          <button
            className={`sidebar-nav-item ${
              activeSection === "balance" ? "active" : ""
            }`}
            onClick={() => handleSectionChange("balance")}
          >
            <span className="nav-icon">💰</span>
            Balance
          </button>
          <button
            className={`sidebar-nav-item ${
              activeSection === "security" ? "active" : ""
            }`}
            onClick={() => handleSectionChange("security")}
          >
            <span className="nav-icon">🔒</span>
            Security
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
              {activeSection === "profile" && "Profile Settings"}
              {activeSection === "balance" && "Balance Management"}
              {activeSection === "security" && "Security Settings"}
            </h1>
            <p className="modern-page-subtitle">
              {activeSection === "profile" &&
                "Manage your personal information"}
              {activeSection === "balance" && "Request balance additions"}
              {activeSection === "security" && "Update your password"}
            </p>
          </div>
          <div className="modern-user-badge">
            <div className="user-badge-avatar">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" />
              ) : (
                <span>👤</span>
              )}
            </div>
            <div className="user-badge-info">
              <p className="user-badge-name">{user.name}</p>
              <p className="user-badge-email">{user.regNo || "Guest"}</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="modern-content-area">
          {/* Profile Section */}
          {activeSection === "profile" && (
            <div className="content-section">
              <div className="modern-card">
                <h3 className="card-title">Profile Photo</h3>
                <div className="profile-photo-section">
                  <div className="profile-photo-preview">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profile" />
                    ) : (
                      <div className="profile-photo-placeholder">👤</div>
                    )}
                  </div>
                  <div className="profile-photo-actions">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="modern-file-input"
                      id="profile-upload"
                    />
                    <label
                      htmlFor="profile-upload"
                      className="modern-btn modern-btn-secondary"
                    >
                      Choose Photo
                    </label>
                    {selectedImage && (
                      <button
                        className="modern-btn modern-btn-primary"
                        onClick={handleSaveProfileImage}
                      >
                        Save Photo
                      </button>
                    )}
                  </div>
                </div>
                {accountStatus.message && (
                  <div
                    className={`modern-alert ${
                      accountStatus.type === "success"
                        ? "alert-success"
                        : "alert-error"
                    }`}
                  >
                    {accountStatus.message}
                  </div>
                )}
              </div>

              <div className="modern-card">
                <h3 className="card-title">Personal Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label className="info-label">Full Name</label>
                    <div className="info-value">{user.name}</div>
                  </div>
                  <div className="info-item">
                    <label className="info-label">Email Address</label>
                    <div className="info-value">
                      {user.email || "Not provided"}
                    </div>
                  </div>
                  <div className="info-item">
                    <label className="info-label">Account Balance</label>
                    <div className="info-value balance-value">
                      PKR {user.balance.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Balance Section */}
          {activeSection === "balance" && (
            <div className="content-section">
              <div className="modern-card">
                <h3 className="card-title">Current Balance</h3>
                <div className="balance-display">
                  <span className="balance-currency">PKR</span>
                  <span className="balance-amount">
                    {user.balance.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="modern-card">
                <h3 className="card-title">Request Balance Addition</h3>
                <p className="card-description">
                  Submit a request to add funds to your account. An
                  administrator will review and approve your request.
                </p>
                <div className="modern-form">
                  <div className="form-group">
                    <label className="form-label">Amount (PKR)</label>
                    <input
                      type="number"
                      value={addBalanceAmount}
                      onChange={(e) => setAddBalanceAmount(e.target.value)}
                      placeholder="Enter amount"
                      min="0"
                      step="0.01"
                      className="modern-input"
                    />
                  </div>
                  <button
                    className="modern-btn modern-btn-primary"
                    onClick={handleAddBalance}
                  >
                    Submit Request
                  </button>
                  {accountStatus.message && (
                    <div
                      className={`modern-alert ${
                        accountStatus.type === "success"
                          ? "alert-success"
                          : "alert-error"
                      }`}
                    >
                      {accountStatus.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Security Section */}
          {activeSection === "security" && (
            <div className="content-section">
              <div className="modern-card">
                <h3 className="card-title">Change Password</h3>
                <p className="card-description">
                  Ensure your account is using a strong password to stay secure.
                </p>
                <div className="modern-form">
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="modern-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="modern-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="modern-input"
                    />
                  </div>
                  <button
                    className="modern-btn modern-btn-primary"
                    onClick={handleChangePassword}
                  >
                    Update Password
                  </button>
                  {passwordStatus.message && (
                    <div
                      className={`modern-alert ${
                        passwordStatus.type === "success"
                          ? "alert-success"
                          : "alert-error"
                      }`}
                    >
                      {passwordStatus.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
