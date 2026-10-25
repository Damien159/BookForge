import { useEffect, useState } from "react";
import { searchBooks } from "../lib/openlibrary";

// query = null: noch nicht laden (Lazy Loading)
export function useBooks(query, limit = 8) {
  const [result, setResult] = useState({ query: null, books: [], error: false });

  useEffect(() => {
    if (!query) return;

    const controller = new AbortController();
    searchBooks(query, controller.signal, limit)
      .then((books) => setResult({ query, books, error: false }))
      .catch((error) => {
        if (error.name !== "AbortError") {
          setResult({ query, books: [], error: true });
        }
      });

    // Beim Wechsel der Suche wird die alte Anfrage abgebrochen
    return () => controller.abort();
  }, [query]);

  let status = "idle";
  if (query) {
    if (result.query !== query) status = "loading";
    else status = result.error ? "error" : "ok";
  }

  return { status, books: status === "ok" ? result.books : [] };
}