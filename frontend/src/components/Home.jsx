import React from "react";

const Home = () => {
  return (
    <section className="home" id="home">
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
          <s>Get yours now</s>
        </a>
      </div>
    </section>
  );
};

export default Home;
