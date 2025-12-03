import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, User as UserIcon, Eye, EyeOff } from "lucide-react";
import LoginImage from "../assets/login.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", { email, password });
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
              <label htmlFor="email">Email</label>
              <div className="input-group">
                <Mail className="field-icon" size={20} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
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

          <div className="signup-prompt">
            <p>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-decoration">
          <img
            src={LoginImage}
            alt="CampusEats Food"
            className="auth-image"
          />
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
