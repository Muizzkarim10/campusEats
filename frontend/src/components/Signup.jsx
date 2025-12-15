import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, UserPlus, Eye, EyeOff, Phone } from "lucide-react";
import SignupImage from "../assets/signup.jpg";

const Signup = () => {
  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus({
        type: "error",
        message: "Passwords do not match!",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, regNo, email, phone, password }),
      });

      const data = await res.json();

      console.log("Signup response:", data); // Debug

      if (res.ok) {
        // Store token and user data immediately after signup
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          console.log("User data stored:", data.user); // Debug
        }

        navigate("/home"); // Go directly to home instead of login

        // Optional: Force reload to update navbar
        window.location.reload();
        setStatus({
          type: "success",
          message: "Signup successful! Redirecting...",
        });
      } else {
        setStatus({
          type: "error",
          message: data.message || "Signup failed.",
        });
      }
    } catch (err) {
      console.error("Signup error:", err);
      setStatus({
        type: "error",
        message: "Server error. Try again later.",
      });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-form-container signup-container">
          <div className="auth-avatar">
            <UserPlus size={50} />
          </div>

          <h1 className="auth-welcome">JOIN US</h1>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-field">
              <label htmlFor="name">Full Name</label>
              <div className="input-group">
                <User className="field-icon" size={20} />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="regNo">Registration Number</label>
              <div className="input-group">
                <Mail className="field-icon" size={20} />
                <input
                  id="regNo"
                  type="text"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  placeholder="e.g. SP24-BCS-000"
                  required
                />
              </div>
            </div>

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
              <label htmlFor="phone">Phone Number</label>
              <div className="input-group">
                <Phone className="field-icon" size={20} />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone"
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
                  placeholder="Create password"
                  required
                  minLength={8}
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

            <div className="form-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-group">
                <Lock className="field-icon" size={20} />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn">
              SIGN UP
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
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-decoration">
          <img src={SignupImage} alt="CampusEats Food" className="auth-image" />
          <div className="auth-overlay">
            <h2>Fresh Campus Meals</h2>
            <p>Quick, Tasty & Affordable</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
