import React from "react";
import { Link } from "react-router-dom"; // ✅ React Router ka Link import
import burger from "../assets/burger-bg.jpg";

const About = () => {
  return (
    <section className="about" id="about">
      <h1 className="heading">
        <span>About</span> Us
      </h1>

      <div className="row">
        {/* Left side image */}
        <div className="image">
          <img src={burger} alt="Delicious food at CampusEats" />
        </div>

        {/* Right side content */}
        <div className="content">
          <h3>What Makes Our Food Special</h3>
          <p>
            At{" "}
            <strong>
              <span>CampusEats</span>
            </strong>
            , every meal is prepared with fresh, high-quality ingredients to
            ensure maximum taste and nutrition. Our signature{" "}
            <strong>
              <span>Campus Burger</span>
            </strong>{" "}
            is a favorite among students, made with juicy patties, fresh
            veggies, and a special sauce that makes every bite unforgettable.
          </p>
          <p>
            We focus on delivering a seamless campus dining experience. From
            perfect seasoning to timely delivery, CampusEats ensures every
            student enjoys delicious food without the hassle of long queues.
          </p>

          {/* Link to UniversityDetails.jsx page */}
          <Link to="/university-details" className="btn">
            Explore More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default About;
