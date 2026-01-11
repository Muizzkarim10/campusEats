import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import LoginImage from "../assets/signup.jpg";

const ResetPassword = () => {
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter code, 3: New password
  const [regNo, setRegNo] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const navigate = useNavigate();

  // Step 1: Request password reset
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ regNo }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setStatus({
          type: "success",
          message: data.devCode
            ? `Reset code: ${data.devCode} (Development mode)`
            : "Reset code sent to your email!",
        });
        setStep(2);
      } else {
        setStatus({
          type: "error",
          message: data.message || "Failed to send reset code.",
        });
      }
    } catch (error) {
      console.error("Reset request error:", error);
      setStatus({
        type: "error",
        message: "Server error. Please try again.",
      });
    }
  };

  // Step 2: Verify reset code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/verify-reset-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ regNo, code: resetCode }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setStatus({
          type: "success",
          message: "Code verified! Enter your new password.",
        });
        setStep(3);
      } else {
        setStatus({
          type: "error",
          message: data.message || "Invalid reset code.",
        });
      }
    } catch (error) {
      console.error("Verify code error:", error);
      setStatus({
        type: "error",
        message: "Server error. Please try again.",
      });
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (newPassword !== confirmPassword) {
      setStatus({
        type: "error",
        message: "Passwords do not match.",
      });
      return;
    }

    if (newPassword.length < 6) {
      setStatus({
        type: "error",
        message: "Password must be at least 6 characters.",
      });
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ regNo, code: resetCode, newPassword }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setStatus({
          type: "success",
          message: "Password reset successful! Redirecting to login...",
        });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setStatus({
          type: "error",
          message: data.message || "Failed to reset password.",
        });
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setStatus({
        type: "error",
        message: "Server error. Please try again.",
      });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-form-container">
          <Link
            to="/login"
            className="back-link"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#666",
              textDecoration: "none",
              marginBottom: "2rem",
            }}
          >
            <ArrowLeft size={20} /> Back to Login
          </Link>

          <h1 className="auth-welcome">RESET PASSWORD</h1>
          <p
            style={{
              textAlign: "center",
              color: "#666",
              marginBottom: "2rem",
              fontSize: "0.95rem",
            }}
          >
            {step === 1 &&
              "Enter your registration number to receive a reset code"}
            {step === 2 && "Enter the code sent to your email"}
            {step === 3 && "Create a new password"}
          </p>

          {/* Step 1: Enter Registration Number */}
          {step === 1 && (
            <form onSubmit={handleRequestReset} className="login-form">
              <div className="form-field">
                <label htmlFor="regNo">Registration Number</label>
                <div className="input-group">
                  <Mail className="field-icon" size={20} />
                  <input
                    id="regNo"
                    type="text"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    placeholder="Enter your registration number"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="login-btn">
                Send Reset Code
              </button>
            </form>
          )}

          {/* Step 2: Enter Reset Code */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="login-form">
              <div className="form-field">
                <label htmlFor="resetCode">Reset Code</label>
                <div className="input-group">
                  <Lock className="field-icon" size={20} />
                  <input
                    id="resetCode"
                    type="text"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="login-btn">
                Verify Code
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  marginTop: "0.8rem",
                  background: "transparent",
                  border: "2px solid #ff6b35",
                  color: "#ff6b35",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Resend Code
              </button>
            </form>
          )}

          {/* Step 3: Enter New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="login-form">
              <div className="form-field">
                <label htmlFor="newPassword">New Password</label>
                <div className="input-group">
                  <Lock className="field-icon" size={20} />
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-group">
                  <Lock className="field-icon" size={20} />
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="login-btn">
                Reset Password
              </button>
            </form>
          )}

          {status.message && (
            <p
              className={`status-message ${
                status.type === "success" ? "success" : "error"
              }`}
            >
              {status.message}
            </p>
          )}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-decoration">
          <img src={LoginImage} alt="CampusEats Food" className="auth-image" />
          <div className="auth-overlay">
            <h2>Reset Your Password</h2>
            <p>Secure your account</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
