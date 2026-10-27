import { useCallback, useState } from "react";
import { readJSON, writeJSON } from "../lib/storage";

export function useReviews(bookKey) {
  const storageKey = `bookforge_reviews_${bookKey}`;
  const [reviews, setReviews] = useState(() => readJSON(storageKey));

  const addReview = useCallback(
    ({ username, rating, comment }) => {
      const existing = readJSON(storageKey);
      if (existing.some((review) => review.username === username)) return;

      const next = [
        {
          username,
          rating,
          comment,
          date: new Date().toLocaleDateString("de-DE"),
        },
        ...existing,
      ];
      writeJSON(storageKey, next);
      setReviews(next);
    },
    [storageKey],
  );

  const count = reviews.length;
  const average =
    count > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / count : 0;

  return { reviews, count, average, addReview };
}