import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, User, Eye, EyeOff, Mail } from "lucide-react";
import { login } from "../services/authService";
import LoginImage from "../assets/signup.jpg";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: "", message: "" });

    try {
      // Check for admin credentials first
      if (identifier === "admin@campuseats.com" && password === "admin123") {
        // Admin login
        const adminUser = {
          name: "Admin",
          email: identifier,
          role: "admin",
          balance: 0,
        };
        localStorage.setItem("user", JSON.stringify(adminUser));
        localStorage.setItem("token", "admin-token");
        
        setStatus({
          type: "success",
          message: "Admin login successful! Redirecting...",
        });
        
        setTimeout(() => {
          navigate("/admin-dashboard");
        }, 500);
        return;
      }

      // Regular user login - try with API
      const data = await login({ regNo: identifier, password });

      if (data.token) {
        // Store token
        localStorage.setItem("token", data.token);

        // Store user data with role
        if (data.user) {
          const userWithRole = { ...data.user, role: "user" };
          localStorage.setItem("user", JSON.stringify(userWithRole));
        }

        setStatus({
          type: "success",
          message: "Login successful! Redirecting...",
        });

        setTimeout(() => {
          navigate("/home");
          window.location.reload();
        }, 500);
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
        message: "Invalid credentials. Please check your registration number and password.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-form-container">
          <div className="auth-avatar">
            <User size={50} />
          </div>

          <h1 className="auth-welcome">WELCOME</h1>
          <p style={{ textAlign: "center", color: "#666", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
            Sign in to your account
          </p>

          <div onSubmit={handleSubmit} className="login-form">
            <div className="form-field">
              <label htmlFor="identifier">Registration Number / Email</label>
              <div className="input-group">
                <Mail className="field-icon" size={20} />
                <input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="SP24-BCS-000 or Admin"
                  required
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-footer">
              <a href="/reset-password" className="forgot-link">
                Forgot Password?
              </a>
            </div>

            <button onClick={handleSubmit} className="login-btn" disabled={isLoading}>
              {isLoading ? "LOGGING IN..." : "LOGIN"}
            </button>
          </div>

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