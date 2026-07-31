import React from "react";
import "./index.css";

const AverageRating = ({ avgRating = 0, totalReviews = 0 }) => {
  const normalizedRating = Math.max(0, Math.min(Number(avgRating) || 0, 5));
  const fullStars = Math.round(normalizedRating);
  const stars = "★".repeat(fullStars) + "☆".repeat(5 - fullStars);

  const handleReviewsClick = (event) => {
    event.preventDefault();
    const reviewsSection = document.getElementById("reviews-section");
    reviewsSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="rating">
      <span className="star">{stars}</span>
      <a href="#reviews-section" onClick={handleReviewsClick}>
        {Number(totalReviews) || 0} avis
      </a>
    </div>
  );
};

export default AverageRating;
