import React, { useEffect, useState } from "react";
import { ShoppingCart, Heart, Eye, Star } from "lucide-react";
import { useCart } from "./cartContext"; // Import Cart Context
import coffee from "../assets/coffee.jpg";
import drinks from "../assets/drinks.jpg";
import meal from "../assets/meal.jpg";
import snack from "../assets/snack.jpg";
import box from "../assets/box.jpg";
import smoothie from "../assets/smoothie.jpg";

const baseProductData = [
  { img: coffee, name: "Fresh Coffee", price: 200.99 },
  { img: drinks, name: "Energy Drink", price: 300.99 },
  { img: smoothie, name: "Smoothie Bowl", price: 700.99 },
  { img: box, name: "Breakfast Box", price: 600.99 },
  { img: snack, name: "Snack Pack", price: 200.99 },
  { img: meal, name: "Meal Combo", price: 900.99 },
];

const Product = () => {
  const { addToCart } = useCart(); // get addToCart function
  const [products, setProducts] = useState(baseProductData);

  useEffect(() => {
    const adminItems =
      JSON.parse(localStorage.getItem("adminItems")) || [];
    const extraProducts = adminItems
      .filter((i) => i.type === "product")
      .map((i) => ({
        img: i.imageUrl || coffee, // fallback
        name: i.name,
        price: i.price,
      }));
    setProducts([...baseProductData, ...extraProducts]);
  }, []);

  const handleAddToCart = (item) => {
    addToCart(item);
    // Removed alert - cart will open automatically
  };

  return (
    <section className="products" id="products">
      <h1 className="heading">
        our <span>products</span>
      </h1>

      <div className="box-container">
        {products.map((item, index) => (
          <div className="box" key={index}>
            <div className="icons">
              <a href="#" onClick={() => handleAddToCart(item)}>
                <ShoppingCart size={18} />
              </a>
              <a href="#">
                <Heart size={18} />
              </a>
              <a href="#">
                <Eye size={18} />
              </a>
            </div>

            <div className="image">
              <img src={item.img} alt={item.name} />
            </div>

            <div className="content">
              <h3>{item.name}</h3>
              <div className="stars">
                <Star size={16} fill="#ffc107" color="#ffc107" />
                <Star size={16} fill="#ffc107" color="#ffc107" />
                <Star size={16} fill="#ffc107" color="#ffc107" />
                <Star size={16} fill="#ffc107" color="#ffc107" />
                <Star size={16} fill="none" color="#ffc107" />
              </div>
              <div className="price">
                Rs {item.price.toFixed(2)} <span>Rs1500.99</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Product;