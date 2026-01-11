import React from "react";
import { useNavigate } from "react-router-dom";

const UniversityDetails = () => {
  const navigate = useNavigate();

  return (
    <section className="university-details">
      <h1 className="title">About COMSATS University Islamabad, Abbottabad Campus</h1>

      {/* University Overview */}
      <div className="section">
        <h2>Overview</h2>
        <p>
          COMSATS University Islamabad, Abbottabad Campus, established in 2001, is a leading
          public university in Pakistan. Known for its strong academic programs, research focus,
          and vibrant campus life, it offers a range of undergraduate and postgraduate courses
          in sciences, technology, business, and social sciences. The campus emphasizes
          innovation, modern infrastructure, and producing globally competent graduates.
        </p>
      </div>

      {/* What Makes Our Food Special */}
      <div className="section">
        <h2>What Makes Our Food Special</h2>
        <p>
          The campus cafeteria experience is elevated with <strong>CampusEats</strong>. Every meal is
          prepared using fresh, high-quality ingredients to ensure taste and nutrition. The
          <strong> Campus Burger</strong> is a student favorite, featuring juicy patties, fresh
          vegetables, and a special sauce that makes every bite unforgettable. Besides burgers,
          a variety of healthy and delicious options are available to cater to all preferences.
        </p>
        <p>
          CampusEats focuses on timely delivery, hygienic preparation, and a seamless food
          ordering experience. Students can enjoy their meals without wasting time in long lines.
        </p>
      </div>

      {/* Campus Life */}
      <div className="section">
        <h2>Campus Life</h2>
        <p>
          Students enjoy a dynamic and inclusive environment. Active student clubs, sports
          tournaments, cultural festivals, and volunteering opportunities are regularly held.
          The campus hosts annual tech and business competitions, encouraging creativity and
          collaboration. Facilities like hostels, libraries, and cafeterias ensure a balanced
          lifestyle while focusing on academics.
        </p>
      </div>

      {/* Facilities */}
      <div className="section">
        <h2>Facilities</h2>
        <p>
          COMSATS Abbottabad offers state-of-the-art classrooms, modern science and computer
          labs, a central library with digital access, sports complexes, and recreational areas.
          Cafeterias such as <strong>CampusEats</strong> provide students with healthy, fresh,
          and delicious meals, minimizing waiting time and allowing students to enjoy their
          free time effectively.
        </p>
      </div>

      {/* Academics */}
      <div className="section">
        <h2>Academics</h2>
        <p>
          The university provides quality education across multiple disciplines. Faculty
          members are highly qualified and guide students through research, practical
          training, and interactive learning. Emphasis is placed on analytical thinking,
          problem-solving, and global competency. Many programs offer internships and
          international collaborations.
        </p>
      </div>

      {/* Achievements */}
      <div className="section">
        <h2>Achievements</h2>
        <p>
          COMSATS Abbottabad has a strong history of academic excellence. Students have won
          national and international awards, published research in top journals, and
          contributed to innovative technology projects. Alumni have excelled in fields such
          as IT, business, government, and academia. The campus is recognized for fostering
          innovation and leadership among students.
        </p>
      </div>

      {/* Why CampusEats App */}
      <div className="section">
        <h2>Why CampusEats App?</h2>
        <p>
          The <strong>CampusEats</strong> app was designed to simplify food ordering for students,
          saving time and ensuring easy access to campus meals. Key benefits include:
        </p>
        <ul>
          <li>Order meals online from multiple campus outlets with a few clicks.</li>
          <li>Quick delivery to hostels, libraries, or designated pick-up points.</li>
          <li>Real-time menu updates and daily specials.</li>
          <li>Exclusive promotions and discounts for students.</li>
          <li>Healthy and fresh options tailored for student preferences.</li>
          <li>Option to pre-order for busy schedules or group orders for events.</li>
        </ul>
        <p>
          CampusEats enhances the campus experience by letting students focus on studies and
          activities without worrying about food queues.
        </p>
      </div>

      {/* Go Back Button */}
      <div className="btn-container">
        <button className="btn-go-back" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    </section>
  );
};

export default UniversityDetails;
