import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ReviewForm({ onSubmit }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (rating === 0) {
      setError("Bitte wähle mindestens 1 Stern aus.");
      return;
    }

    onSubmit({ username: user, rating, comment: comment.trim() });
    setRating(0);
    setComment("");
    setError("");
  }

  return (
    <div className="review-form-box">
      <h4>Bewertung schreiben</h4>

      {!user ? (
        <div className="hint-box">
          <p>Bitte melde dich an, um eine Bewertung abzugeben.</p>
        </div>
      ) : (
        <form className="review-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label id="rating-label">Deine Bewertung:</label>
            <div
              className="star-rating-input"
              role="radiogroup"
              aria-labelledby="rating-label"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <span
                  key={value}
                  className={`star${value <= rating ? " active" : ""}`}
                  role="radio"
                  aria-checked={value === rating}
                  aria-label={`${value} ${value === 1 ? "Stern" : "Sterne"}`}
                  tabIndex={0}
                  onClick={() => setRating(value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setRating(value);
                    }
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="review-text">Dein Kommentar:</label>
            <textarea
              id="review-text"
              rows="4"
              placeholder="Wie hat dir das Buch gefallen?"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              required
            />
          </div>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary">
            Bewertung abschicken
          </button>
        </form>
      )}
    </div>
  );
}