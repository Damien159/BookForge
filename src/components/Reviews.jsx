import { useReviews } from "../hooks/useReviews";
import ReviewForm from "./ReviewForm";

// Der Speicher ist von außen veränderbar, deshalb wird der Wert begrenzt
const stars = (value) => {
  const filled = Math.min(5, Math.max(0, Math.round(value) || 0));
  return "★".repeat(filled) + "☆".repeat(5 - filled);
};

export default function Reviews({ bookKey }) {
  const { reviews, count, average, addReview } = useReviews(bookKey);

  return (
    <section className="reviews-section">
      <h3>Kundenbewertungen</h3>

      <div className="rating-overview">
        <div className="rating-score">
          <span>{average.toFixed(1).replace(".", ",")}</span>{" "}
          <span className="stars-display">{stars(average)}</span>
        </div>
        <p id="total-reviews-count">
          ({count} {count === 1 ? "Bewertung" : "Bewertungen"})
        </p>
      </div>

      <ReviewForm onSubmit={addReview} />

      <div className="reviews-list">
        {count === 0 && <p>Noch keine Bewertungen vorhanden. Sei der Erste!</p>}
        {reviews.map((review, index) => (
          <div
            className="review-card"
            key={`${review.username}-${review.date}-${index}`}
          >
            <div className="review-header">
              <span className="review-user">{review.username}</span>
              <span className="review-date">{review.date}</span>
            </div>
            <div className="review-stars">{stars(review.rating)}</div>
            <p className="review-comment">{review.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
