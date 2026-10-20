import { useEffect, useState } from "react";
import { fetchBook } from "../lib/openlibrary";

export function useBook(key) {
  const [result, setResult] = useState({ key: null, book: null, error: false });

  useEffect(() => {
    if (!key) return;

    const controller = new AbortController();
    fetchBook(key, controller.signal)
      .then((book) => setResult({ key, book, error: false }))
      .catch((error) => {
        if (error.name !== "AbortError") {
          setResult({ key, book: null, error: true });
        }
      });

    // Beim Wechsel des Buchs wird die alte Anfrage abgebrochen
    return () => controller.abort();
  }, [key]);

  if (result.key !== key) return { status: "loading", book: null };
  if (result.error) return { status: "error", book: null };
  return { status: "ok", book: result.book };
}