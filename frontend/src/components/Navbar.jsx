import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Menu as MenuIcon,
  X,
  User,
  Plus,
  Minus,
} from "lucide-react";
import { useCart } from "../components/cartContext";
import logo from "../assets/Logo.png";

const Navbar = () => {
  const cartRef = useRef(null);
  const profileRef = useRef(null);
  const [activePanel, setActivePanel] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    isCartOpen,
    openCart,
    closeCart,
    cartItemCount,
    cartTotal,
  } = useCart();

  // Sync context cart state with local panel state
  useEffect(() => {
    if (isCartOpen) {
      setActivePanel("cart");
    }
  }, [isCartOpen]);

  // Update isMobile on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const togglePanel = (panel) => {
    if (activePanel === panel) {
      setActivePanel(null);
      if (panel === "cart") closeCart();
    } else {
      setActivePanel(panel);
      if (panel === "cart") openCart();
    }
  };

  // Get current user and keep balance in sync with shared per-email balances
  const storedUser = JSON.parse(localStorage.getItem("user")) || {
    name: "Guest",
    email: "",
    balance: 0,
  };
  const balances = JSON.parse(localStorage.getItem("userBalances")) || {};
  const effectiveBalance = storedUser.email
    ? Number(balances[storedUser.email] || 0)
    : 0;

  const user = {
    ...storedUser,
    balance: effectiveBalance,
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="header">
      {/* Logo */}
      <Link to="/" className="logo">
        <img src={logo} alt="CampusEats Logo" />
      </Link>

      {/* Hamburger Menu for Mobile */}
      {isMobile && (
        <div className="menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <MenuIcon size={22} />
        </div>
      )}

      {/* Navigation */}
      <nav className={`navbar ${isMobile && isMenuOpen ? "active" : ""}`}>
        <Link to="/home" onClick={() => setIsMenuOpen(false)}>
          Home
        </Link>
        <Link to="/about" onClick={() => setIsMenuOpen(false)}>
          About
        </Link>
        <Link to="/menu" onClick={() => setIsMenuOpen(false)}>
          Menu
        </Link>
        <Link to="/products" onClick={() => setIsMenuOpen(false)}>
          Products
        </Link>
        <Link to="/review" onClick={() => setIsMenuOpen(false)}>
          Review
        </Link>
        <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
          Contact
        </Link>
        <Link to="/blogs" onClick={() => setIsMenuOpen(false)}>
          Blogs
        </Link>
      </nav>

      {/* Icons */}
      <div className="icons">
        <div
          onClick={() => togglePanel("cart")}
          style={{ position: "relative" }}
        >
          <ShoppingCart size={22} />
          {cartItemCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                background: "linear-gradient(135deg, #ffc107, #ff9800)",
                color: "#13131a",
                borderRadius: "50%",
                width: "22px",
                height: "22px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: "bold",
                boxShadow: "0 2px 10px rgba(255, 193, 7, 0.5)",
                border: "2px solid rgba(255, 193, 7, 0.3)",
              }}
            >
              {cartItemCount}
            </span>
          )}
        </div>
        <div onClick={() => togglePanel("profile")}>
          <User size={22} />
        </div>
      </div>

      {/* Cart Panel */}
      <div
        className={`panel cart-panel ${activePanel === "cart" ? "active" : ""}`}
        ref={cartRef}
      >
        {cart.length === 0 ? (
          <p style={{ padding: "1rem", color: "#fff" }}>Your cart is empty</p>
        ) : (
          <>
            {cart.map((item, index) => (
              <div className="cart-item" key={index}>
                <X
                  className="close-icon"
                  size={20}
                  onClick={() => removeFromCart(index)}
                />
                <img src={item.img} alt={item.name} />
                <div className="content">
                  <h3>{item.name}</h3>
                  <div className="price">Pkr {item.price}/-</div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginTop: "10px",
                    }}
                  >
                    <button
                      onClick={() => decreaseQuantity(index)}
                      style={{
                        background: "linear-gradient(135deg, #ffc107, #ff9800)",
                        color: "#13131a",
                        border: "none",
                        borderRadius: "6px",
                        width: "30px",
                        height: "30px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 8px rgba(255, 193, 7, 0.3)",
                        transition: "all 0.3s ease",
                        fontWeight: "bold",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(255, 193, 7, 0.5)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 2px 8px rgba(255, 193, 7, 0.3)";
                      }}
                    >
                      <Minus size={16} />
                    </button>
                    <span
                      style={{
                        color: "black",
                        fontWeight: "bold",
                        minWidth: "35px",
                        textAlign: "center",
                        fontSize: "1.6rem",
                        background: "rgba(255, 193, 7, 0.1)",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        border: "1px solid rgba(255, 193, 7, 0.3)",
                      }}
                    >
                      {item.quantity || 1}
                    </span>
                    <button
                      onClick={() => increaseQuantity(index)}
                      style={{
                        background: "linear-gradient(135deg, #ffc107, #ff9800)",
                        color: "#13131a",
                        border: "none",
                        borderRadius: "6px",
                        width: "30px",
                        height: "30px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 8px rgba(255, 193, 7, 0.3)",
                        transition: "all 0.3s ease",
                        fontWeight: "bold",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(255, 193, 7, 0.5)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 2px 8px rgba(255, 193, 7, 0.3)";
                      }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div
              style={{
                padding: "1.5rem",
                borderTop: "2px solid rgba(255, 193, 7, 0.3)",
                background: "rgba(255, 193, 7, 0.05)",
                margin: "0 -1.5rem",
                marginTop: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "#fff",
                  fontSize: "1.8rem",
                  fontWeight: "bold",
                }}
              >
                <span>Total:</span>
                <span
                  style={{
                    background: "linear-gradient(135deg, #ffc107, #ff9800)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Pkr {cartTotal}/-
                </span>
              </div>
            </div>
            <Link
              className="btn"
              to="/checkout"
              onClick={() => {
                setActivePanel(null);
                closeCart();
              }}
              style={{ width: "100%", marginTop: "1.5rem" }}
            >
              Checkout Now
            </Link>
          </>
        )}
      </div>

      {/* Profile Panel */}
      <div
        className={`panel profile-panel ${
          activePanel === "profile" ? "active" : ""
        }`}
        ref={profileRef}
      >
        <div className="profile-items">
          <div className="profile-info">
            <p>
              <strong>{user.name}</strong>
            </p>
            <p>Balance: PKR {Number(user.balance || 0).toFixed(2)}</p>
          </div>
          <hr />
          <ul>
            <li>
              <Link to="/my-orders">My Orders</Link>
            </li>
            <li>
              <Link to="/account">Account Settings</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
