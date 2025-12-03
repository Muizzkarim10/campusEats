import React from 'react';
import burger from "../assets/burger.jpg";
import pizza from "../assets/pizza.jpg";
import salad from "../assets/salad.jpg";
import soup from "../assets/soup.jpg";
import wings from "../assets/wings.jpg";
import pasta from "../assets/pasta.jpg";

const menuData = [
  { img: burger, name: "Campus Burger", price: 8.99 },
  { img: pizza, name: "Veggie Pizza", price: 12.99 },
  { img: salad, name: "Fresh Salad", price: 6.99 },
  { img: pasta, name: "Pasta Special", price: 10.99 },
  { img: wings, name: "Chicken Wings", price: 9.99 },
  { img: soup, name: "Soup Bowl", price: 5.99 }
];

const Menu = () => {
  return (
    <section className='menu' id='menu'>
      <h1 className='heading'>
        Our <span>Menu</span>
      </h1>
      <div className='box-container'>
        {menuData.map((item, index) => (
          <div className='box' key={index}>
            <img src={item.img} alt={item.name} />
            <h3>{item.name}</h3>
            <div className='price'>
              ${item.price.toFixed(2)}
            </div>
            <a href='#cart' className='btn'>Add to Cart</a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Menu;
