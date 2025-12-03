import React from "react";
import { ShoppingCart, Heart, Eye, Star } from "lucide-react";
import coffee from "../assets/coffee.jpg";
import drinks from "../assets/drinks.jpg";
import meal from "../assets/meal.jpg";
import snack from "../assets/snack.jpg";
import box from "../assets/box.jpg";
import smoothie from "../assets/smoothie.jpg";

const productData = [
  { img: coffee, name: "Fresh Coffee", price: 4.99 },
  { img: drinks, name: "Energy Drink", price: 3.99 },
  { img: smoothie, name: "Smoothie Bowl", price: 7.99 },
  { img: box, name: "Breakfast Box", price: 9.99 },
  { img: snack, name: "Snack Pack", price: 5.99 },
  { img: meal, name: "Meal Combo", price: 14.99 },
  { img: meal, name: "Meal Combo", price: 14.99 },
  { img: meal, name: "Meal Combo", price: 14.99 },
];

const Product = () => {
  return (
    <section className="products" id="products">
      <h1 className="heading">
        our <span>products</span>
      </h1>

      <div className="box-container">
        {productData.map((item, index) => (
          <div className="box" key={index}>
            <div className="icons">
              <a href="#">
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
                ${item.price.toFixed(2)} <span>$20.99</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Product;
