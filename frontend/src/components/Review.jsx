import React from 'react';
import { Star, Quote } from 'lucide-react';
import reviewImage1 from '../assets/review-1.jpg';
import reviewImage2 from '../assets/review-2.jpg';
import reviewImage3 from '../assets/review-3.jpg';

const reviewData = [
  {
    img: reviewImage1,
    name: "John Doe",
    feedback: "Amazing food quality! The Campus Burger is my favorite. Quick delivery and always fresh. CampusEats has become my go-to for meals."
  },
  {
    img: reviewImage3,
    name: "Sarah Smith",
    feedback: "Love the variety of options available. Healthy choices and great taste. The app is easy to use and delivery is super fast!"
  },
  {
    img: reviewImage2,
    name: "Jesse Lee",
    feedback: "Best campus food service ever! Fresh ingredients, reasonable prices, and the staff is always friendly. Highly recommend!"
  }
];

const Review = () => {
  return (
    <section className='review' id='review'>
      <h1 className='heading'>
        customer's <span>review</span>
      </h1>

      <div className='box-container'>
        {reviewData.map((item, index) => (
          <div className="box" key={index}>
            {/* Quote icon */}
            <Quote className='quote' size={60} color="#ffc107" />

            {/* Feedback */}
            <p>{item.feedback}</p>

            {/* User image */}
            <img src={item.img} alt={item.name} className='user' />

            {/* User name */}
            <h3>{item.name}</h3>

            {/* Stars */}
            <div className='stars'>
              <Star size={16} fill="#ffc107" color="#ffc107" />
              <Star size={16} fill="#ffc107" color="#ffc107" />
              <Star size={16} fill="#ffc107" color="#ffc107" />
              <Star size={16} fill="#ffc107" color="#ffc107" />
              <Star size={16} fill="none" color="#ffc107" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Review;
