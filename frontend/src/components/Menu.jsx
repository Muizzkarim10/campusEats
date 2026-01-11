import React, { useEffect, useState } from "react";
import { useCart } from "./cartContext"; // Import the Cart Context
import burger from "../assets/product.jpg";
import pizza from "../assets/crossant.jpg";
import salad from "../assets/coffee.jpg";
import soup from "../assets/soup.jpg";
import wings from "../assets/wingss.jpg";
import pasta from "../assets/pasta.jpg";
import kabab from "../assets/steak.jpg";
import chowmein from "../assets/chowmein.jpg";
import icee from "../assets/icee.jpg";
import sandwich from "../assets/sandd.jpg";
import biryani from "../assets/menu-7.jpg";
import shawarma from "../assets/shawrma.jpg";

const baseMenuData = [
  { img: burger, name: "Campus Burger", price: 350 },
  { img: pizza, name: "crossant", price: 600 },
  { img: salad, name: "coffee", price: 150 },
  { img: pasta, name: "Pasta Special", price: 400 },
  { img: wings, name: "Chicken Wings", price: 700 },
  { img: soup, name: "Soup Bowl", price: 300 },
  { img: kabab, name: "Steak", price: 500 },
  { img: chowmein, name: "chowmein", price: 550 },
  { img: icee, name: "ice-cream", price: 200 },
  { img: biryani, name: "biryani", price: 450 },
  { img: sandwich, name: "cup cake", price: 250 },
  { img: shawarma, name: "shawarma", price: 300 },
];

const Menu = () => {
  const { addToCart } = useCart(); // Get addToCart function from context
  const [menuItems, setMenuItems] = useState(baseMenuData);

  useEffect(() => {
    const adminItems =
      JSON.parse(localStorage.getItem("adminItems")) || [];
    const extraMenuItems = adminItems
      .filter((i) => i.type === "menu")
      .map((i) => ({
        img: i.imageUrl || burger, // fallback image
        name: i.name,
        price: i.price,
      }));
    setMenuItems([...baseMenuData, ...extraMenuItems]);
  }, []);

  const handleAddToCart = (item) => {
    addToCart(item);
    // Removed alert - cart will open automatically now
  };

  return (
    <section className="menu" id="menu">
      <h1 className="heading">
        Our <span>Menu</span>
      </h1>
      <div className="box-container">
        {menuItems.map((item, index) => (
          <div className="box" key={index}>
            <img src={item.img} alt={item.name} />
            <h3>{item.name}</h3>
            <div className="price">Rs {item.price.toFixed(2)}</div>
            <button className="btn" onClick={() => handleAddToCart(item)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Menu;
