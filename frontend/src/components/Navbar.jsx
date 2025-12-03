import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, Menu as MenuIcon, X } from "lucide-react";
import burger from "../assets/burger.jpg";
import pizza from "../assets/pizza.jpg";
import salad from "../assets/salad.jpg";
import logo from "../assets/Logo.png";

const cartData = [
  { img: burger, name: "Campus Burger", price: "8.99" },
  { img: pizza, name: "Veggie Pizza", price: "12.99" },
  { img: salad, name: "Fresh Salad", price: "6.99" },
];

const Navbar = () => {
  const searchRef = useRef(null);
  const cartRef = useRef(null);
  const navbarRef = useRef(null);

  const searchHandler = () => {
    searchRef.current?.classList.toggle("active");
    cartRef.current?.classList.remove("active");
    navbarRef.current?.classList.remove("active");
  };

  const cartHandler = () => {
    cartRef.current?.classList.toggle("active");
    searchRef.current?.classList.remove("active");
    navbarRef.current?.classList.remove("active");
  };

  const navbarHandler = () => {
    navbarRef.current?.classList.toggle("active");
    searchRef.current?.classList.remove("active");
    cartRef.current?.classList.remove("active");
  };

  return (
    <header className="header">
      {/* Logo */}
      <Link to="/" className="logo">
        <img src={logo} alt="CampusEats Logo" />
      </Link>

      {/* Navigation */}
      <nav className="navbar" ref={navbarRef}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/products">Products</Link>
        <Link to="/review">Review</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/blogs">Blogs</Link>
      </nav>

      {/* Top-right icons */}
      <div className="icons">
        <div onClick={searchHandler}>
          <Search size={22} />
        </div>
        <div onClick={cartHandler}>
          <ShoppingCart size={22} />
        </div>
        <div id="menu-btn" onClick={navbarHandler}>
          <MenuIcon size={22} />
        </div>
      </div>

      {/* Search bar */}
      <div className="search-form" ref={searchRef}>
        <input
          type="search"
          placeholder="Search for dishes or restaurants..."
          id="search-box"
        />
        <label htmlFor="search-box">
          <Search size={20} />
        </label>
      </div>

      {/* Cart items */}
      <div className="cart-items-container" ref={cartRef}>
        {cartData.map((item, index) => (
          <div className="cart-item" key={index}>
            <X className="close-icon" size={20} />
            <img src={item.img} alt={item.name} />
            <div className="content">
              <h3>{item.name}</h3>
              <div className="price">${item.price}/-</div>
            </div>
          </div>
        ))}
        <Link className="btn" to="/checkout">
          Checkout Now
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
