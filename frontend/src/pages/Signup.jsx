import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

import logoImage from "../assets/logo.png";
import leftBgImage from "../assets/bg.png";
import bgImage from "../assets/background.jpg";

// For images in public folder, use direct paths like: "/images/logo.png"

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          name,
          email,
          password,
          role,
        }
      );

      setSuccess("Signup successful! Redirecting to login...");
      setError("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
      setSuccess("");
    }
  };

  return (
    <div className="signup-page">
      <div className="bg-image-overlay"></div>
      <div className="bg-circles">
        <div className="circle circle-orange"></div>
        <div className="circle circle-blue"></div>
        <div className="circle circle-green"></div>
        <div className="circle circle-purple"></div>
        <div className="circle circle-cyan"></div>
        <div className="circle circle-pink"></div>
      </div>
      {/* Main Card Container */}
      <div className="container d-flex justify-content-center align-items-center min-vh-100 py-5">
        <div className="signup-container">
          <div className="signup-card-wrapper">
            <div className="card-left">
              <button className="back-btn" onClick={() => navigate(-1)}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </button>

              <div className="gradient-artwork">
                <div className="gradient-sphere gradient-sphere-1"></div>
                <div className="gradient-sphere gradient-sphere-2"></div>
                <div className="gradient-sphere gradient-sphere-3"></div>

                <div className="card-left">
                  <div className="left-bg"></div> {/* background layer */}
                  <div className="left-content">
                    <img
                      src={logoImage}
                      alt="uniFoods Logo"
                      className="left-logo"
                    />
                    <h1 className="left-title">uniFoods</h1>
                    <p className="left-subtitle">
                      Your University Food Community
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="card-right">
              <div className="form-header">
                {/* Small logo in header (optional) */}
                {/* <img src="/images/logo-small.png" alt="Logo" className="header-logo" /> */}

                <button
                  className="login-link"
                  onClick={() => navigate("/login")}
                >
                  Log in
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              <div className="form-content">
                <h2 className="form-title">CREATE AN ACCOUNT</h2>

                {/* Alerts */}
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="alert alert-success" role="alert">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSignup}>
                  {/* Full Name */}
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control modern-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control modern-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="E-mail"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control modern-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                    />
                  </div>

                  {/* Role */}
                  <div className="mb-3">
                    <select
                      className="form-select modern-input"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  {/* Remember Me */}
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember Me
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="btn signup-btn w-100 mb-3">
                    Sign Up
                  </button>

                  {/* Forgot Password */}
                  <div className="text-end mb-3">
                    <a href="#" className="forgot-link">
                      Forgot password?
                    </a>
                  </div>

                  {/* Terms */}
                  <p className="terms-text">
                    By signing up you agree to
                    <br />
                    Terms & Conditions and Content Policy
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
