import React from "react";
import fav from "../assets/fav.jpg";
import meals from "../assets/meals.jpg";
import food from "../assets/food.jpg";

const blogData = [
  { img: food, title: "Tasty and Refreshing Food", date: "21st May, 2021" },
  { img: meals, title: "Healthy Campus Meals", date: "21st May, 2021" },
  { img: fav, title: "Quick Student Favorites", date: "21st May, 2021" },
];

const Blog = () => {
  return (
    <section className="blogs" id="blogs">
      <h1 className="heading">
        our <span>blogs</span>
      </h1>

      <div className="box-container">
        {blogData.map((item, index) => (
          <div className="box" key={index}>
            <div className="image">
              <img src={item.img} alt={item.title} />
            </div>

            <div className="content">
              <a href="#" className="title">
                {item.title}
              </a>
              <span>by admin / {item.date}</span>
              <p>
                Explore tasty meals and healthy recipes, perfect for students on
                campus. Quick, fresh, and easy!
              </p>
              <a href="#" className="btn">
                read more
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Blog;
