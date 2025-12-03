import React from "react";
import homeBg from "../assets/special.jpeg";

const Home = () => {
  return (
    <section
      className="home"
      id="home"
      style={{
        backgroundImage: `url(${homeBg})`,
        backgroundSize: "center", // makes image cover whole section
        backgroundPosition: "center", // centers the image
        backgroundRepeat: "no-repeat", // prevents repeating
      }}
    >
      <div className="content">
        <h3>
          Your <span>Campus Cravings</span> <br /> Delivered{" "}
          <span>Fresh & Fast</span>
        </h3>
        <p>
          CampusEats lets students explore menus, place orders, and get meals
          right at their university spots. Fast, fresh, and hassle-free!
        </p>
        <a href="#menu" className="btn">
          Get Yours Now
        </a>
      </div>
    </section>
  );
};

export default Home;
