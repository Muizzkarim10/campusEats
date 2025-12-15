import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, User as UserIcon, Eye, EyeOff } from "lucide-react";
import { login } from "../services/authService";
import LoginImage from "../assets/signup.jpg";

const Login = () => {
  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for admin credentials first
    if (regNo === "admin@campuseats.com" && password === "admin123") {
      // Admin login
      const adminUser = {
        name: "Admin",
        email: regNo,
        role: "admin",
        balance: 0, // Admins don't need balance
      };
      localStorage.setItem("user", JSON.stringify(adminUser));
      localStorage.setItem("token", "admin-token"); // Dummy token for admin
      navigate("/admin-dashboard");
      return;
    }

    // Regular user login
    try {
      const data = await login({ regNo, password });

      if (data.token) {
        // Store token
        localStorage.setItem("token", data.token);

        // Store user data with role
        if (data.user) {
          const userWithRole = { ...data.user, role: "user" };
          localStorage.setItem("user", JSON.stringify(userWithRole));
        }

        // Debug: Check what's stored
        console.log("Stored user data:", localStorage.getItem("user"));

        navigate("/home");

        // Optional: Force reload to update navbar immediately
        window.location.reload();
      } else {
        setStatus({
          type: "error",
          message: data.message || "Invalid credentials.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
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
          <div className="auth-avatar">
            <UserIcon size={50} />
          </div>

          <h1 className="auth-welcome">WELCOME</h1>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-field">
              <label htmlFor="regNo">Registration Number</label>
              <div className="input-group">
                <input
                  id="regNo"
                  type="text"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  placeholder="Enter your registration number (e.g. SP24-BCS-000)"
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="password">Password</label>
              <div className="input-group">
                <Lock className="field-icon" size={20} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-footer">
              <a href="#" className="forgot-link">
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="login-btn">
              LOGIN
            </button>
          </form>

          {status.message && (
            <p
              className={`status-message ${
                status.type === "success" ? "success" : "error"
              }`}
            >
              {status.message}
            </p>
          )}

          <div className="signup-prompt">
            <p>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
            <p>
              <Link to="/admin-login" className="admin-login-link">
                Admin Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-decoration">
          <img src={LoginImage} alt="CampusEats Food" className="auth-image" />
          <div className="auth-overlay">
            <h2>Your Campus Cravings</h2>
            <p>Delivered Fresh & Fast</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
