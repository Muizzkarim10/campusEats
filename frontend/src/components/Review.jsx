import React, { useState, useEffect } from "react";
import { Star, Quote, Plus, X, User } from "lucide-react";

const initialReviewData = [];

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    feedback: "",
    rating: 5,
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    name: "",
    role: "",
    profileImage: null,
    email: "",
  });

  // Load user data
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {
      name: "Guest",
      role: "",
      profileImage: null,
      email: "",
    };

    // Get user's profile image if it exists
    const profileImages =
      JSON.parse(localStorage.getItem("userProfileImages")) || {};
    const userProfileImage = storedUser.email
      ? profileImages[storedUser.email]
      : null;

    setUser({
      ...storedUser,
      profileImage: userProfileImage || storedUser.profileImage || null,
    });
  }, []);

  const isAdmin = user.role === "admin";

  // Load reviews from localStorage on mount
  useEffect(() => {
    try {
      // localStorage.removeItem("campus-reviews");
      const storedReviews = localStorage.getItem("campus-reviews");
      if (storedReviews) {
        setReviews(JSON.parse(storedReviews));
      } else {
        // First time - initialize with default reviews
        setReviews(initialReviewData);
        localStorage.setItem(
          "campus-reviews",
          JSON.stringify(initialReviewData)
        );
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
      setReviews(initialReviewData);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save reviews to localStorage
  const saveReviews = (updatedReviews) => {
    try {
      localStorage.setItem("campus-reviews", JSON.stringify(updatedReviews));
      setReviews(updatedReviews);
      console.log("Reviews saved successfully:", updatedReviews.length);
    } catch (error) {
      console.error("Error saving reviews:", error);
      setStatus({
        type: "error",
        message: "Failed to save review. Please try again.",
      });
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (!newReview.name || !newReview.feedback) {
      setStatus({
        type: "error",
        message: "Please fill in all fields.",
      });
      return;
    }

    const reviewToAdd = {
      img: user.profileImage || null, // Store null if no profile image
      name: newReview.name,
      feedback: newReview.feedback,
      rating: newReview.rating,
      timestamp: Date.now(),
    };

    const updatedReviews = [reviewToAdd, ...reviews];
    saveReviews(updatedReviews);

    setNewReview({ name: "", feedback: "", rating: 5 });
    setShowModal(false);
    setStatus({
      type: "success",
      message: "Review submitted successfully!",
    });

    // Clear success message after 3 seconds
    setTimeout(() => setStatus({ type: "", message: "" }), 3000);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        fill={index < rating ? "#ffc107" : "none"}
        color="#ffc107"
      />
    ));
  };

  if (loading) {
    return (
      <section className="review" id="review">
        <p style={{ textAlign: "center", padding: "2rem" }}>
          Loading reviews...
        </p>
      </section>
    );
  }

  return (
    <section className="review" id="review">
      <h1 className="heading">
        customer's <span>review</span>
      </h1>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="review-list">
          {reviews.map((item, index) => (
            <div className="review-item" key={index}>
              <div className="review-header">
                {/* Conditional rendering for avatar */}
                {item.img ? (
                  <img
                    src={item.img}
                    alt={item.name}
                    className="review-avatar"
                  />
                ) : (
                  <div className="review-avatar-placeholder">
                    <User size={24} color="#666" />
                  </div>
                )}
                <div className="review-info">
                  <h3>{item.name}</h3>
                  <div className="stars">{renderStars(item.rating)}</div>
                </div>
                <Quote
                  className="quote-icon"
                  size={30}
                  color="rgba(255, 193, 7, 0.3)"
                />
              </div>
              <p className="review-text">{item.feedback}</p>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "3rem", color: "#666" }}>
          <p>No reviews yet. Be the first to share your experience!</p>
        </div>
      )}

      {/* Add Review Button (hidden for admin) */}
      {!isAdmin && (
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <button
            className="btn"
            onClick={() => {
              setNewReview({ ...newReview, name: user.name || "" });
              setShowModal(true);
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Plus size={20} />
            Add Your Review
          </button>
        </div>
      )}

      {!isAdmin && status.message && (
        <p
          className={`status-message ${
            status.type === "success" ? "success" : "error"
          }`}
          style={{ textAlign: "center", marginTop: "1rem" }}
        >
          {status.message}
        </p>
      )}

      {/* Add Review Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Write a Review</h2>
              <button
                className="close-modal"
                onClick={() => setShowModal(false)}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitReview}>
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  value={newReview.name}
                  onChange={(e) =>
                    setNewReview({ ...newReview, name: e.target.value })
                  }
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Rating</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={30}
                      fill={star <= newReview.rating ? "#ffc107" : "none"}
                      color="#ffc107"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setNewReview({ ...newReview, rating: star })
                      }
                    />
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Your Review</label>
                <textarea
                  value={newReview.feedback}
                  onChange={(e) =>
                    setNewReview({ ...newReview, feedback: e.target.value })
                  }
                  placeholder="Share your experience..."
                  rows="5"
                  required
                />
              </div>

              <button type="submit" className="btn submit-review-btn">
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Review;
