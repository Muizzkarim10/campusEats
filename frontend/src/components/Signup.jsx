import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, User, UserPlus, Eye, EyeOff, Phone } from "lucide-react";
import SignupImage from "../assets/signup.jpg";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Signup:", { name, email, phone, password });
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

          <div className="signup-prompt">
            <p>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-decoration">
          <img
            src={SignupImage}
            alt="CampusEats Food"
            className="auth-image"
          />
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
