import { useCallback, useEffect, useState } from "react";
import { searchBooks } from "../lib/openlibrary";

// query = null: noch nicht laden (Lazy Loading)
export function useBooks(query) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({
    query: null,
    attempt: 0,
    books: [],
    error: false,
  });

  useEffect(() => {
    if (!query) return;

    const controller = new AbortController();
    searchBooks(query, controller.signal)
      .then((books) => setResult({ query, attempt, books, error: false }))
      .catch((error) => {
        if (error.name !== "AbortError") {
          setResult({ query, attempt, books: [], error: true });
        }
      });

    // Beim Wechsel der Suche wird die alte Anfrage abgebrochen
    return () => controller.abort();
  }, [query, attempt]);

  const retry = useCallback(() => setAttempt((count) => count + 1), []);

  let status = "idle";
  if (query) {
    if (result.query !== query || result.attempt !== attempt) status = "loading";
    else status = result.error ? "error" : "ok";
  }

  return { status, books: status === "ok" ? result.books : [], retry };
}