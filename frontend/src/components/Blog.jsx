import React, { useState, useEffect } from "react";
import fav from "../assets/fav.jpg";
import meals from "../assets/meals.jpg";
import food from "../assets/food.jpg";
import "../styles/style.css";

const blogData = [
  {
    img: food,
    title: "Tasty and Refreshing Food",
    date: "21st May, 2021",
    summary:
      "Explore tasty meals and healthy recipes, perfect for students on campus.",
    full: " Enjoy a variety of fresh ingredients and flavors that keep your energy high throughout the day. Learn how to combine fruits, veggies, and proteins for a balanced meal that is quick and easy to prepare.",
  },
  {
    img: meals,
    title: "Healthy Campus Meals",
    date: "21st May, 2021",
    summary:
      "Discover how to maintain a healthy diet while studying on campus.",
    full: " From nutritious salads to protein-packed snacks, we cover meal planning that saves time and money. Tips on portion control and mixing flavors to make healthy eating exciting and sustainable.",
  },
  {
    img: fav,
    title: "Quick Student Favorites",
    date: "21st May, 2021",
    summary: "Learn quick and delicious recipes that every student loves.",
    full: " These meals are designed to be both tasty and hassle-free, perfect for late-night study sessions or busy mornings. Easy recipes include sandwiches, wraps, smoothies, and energy-boosting snacks that anyone can make.",
  },
];

const Blog = () => {
  const [adminBlogs, setAdminBlogs] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [expanded, setExpanded] = useState([]);

  useEffect(() => {
    // Load admin-added blogs from localStorage
    const storedBlogs = JSON.parse(localStorage.getItem("adminBlogs")) || [];
    setAdminBlogs(storedBlogs);

    // Normalize admin blogs to match the structure of blogData
    const normalizedAdminBlogs = storedBlogs.map((blog) => ({
      img: blog.imageUrl || food, // fallback image if no imageUrl
      title: blog.title,
      date: new Date(blog.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }), // Format date
      summary:
        blog.content.length > 100
          ? blog.content.substring(0, 100) + "..."
          : blog.content, // Truncate for summary
      full: blog.content,
      isAdmin: true, // Flag to identify admin blogs
    }));

    // Combine static blogs and admin blogs
    const combinedBlogs = [...blogData, ...normalizedAdminBlogs];
    setAllBlogs(combinedBlogs);
    setExpanded(Array(combinedBlogs.length).fill(false)); // Initialize expanded state
  }, []);

  const toggleReadMore = (index) => {
    const newExpanded = [...expanded];
    newExpanded[index] = !newExpanded[index];
    setExpanded(newExpanded);
  };

  return (
    <section className="blogs" id="blogs">
      <h1 className="heading">
        our <span>blogs</span>
      </h1>

      <div className="box-container">
        {allBlogs.map((item, index) => (
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
                {item.summary}{" "}
                {expanded[index] &&
                  item.full.substring(item.summary.length - 3)}{" "}
                {/* Show full if expanded */}
              </p>
              <button className="btn" onClick={() => toggleReadMore(index)}>
                {expanded[index] ? "show less" : "read more"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Blog;
