import { useEffect, useRef, useState } from "react";
import { useBooks } from "../hooks/useBooks";
import BookCard from "./BookCard";

export default function BookSection({ id, title, query, limit = 8, eager = false }) {
  const ref = useRef(null);
  // Ohne IntersectionObserver wird sofort geladen
  const [visible, setVisible] = useState(
    () => eager || !("IntersectionObserver" in window),
  );

  // Erst laden, wenn die Sektion in die Nähe des Bildschirms kommt
  useEffect(() => {
    if (visible || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [visible]);

  const { status, books, retry } = useBooks(visible ? query : null, limit);

  return (
    <section id={id} className="buecher-sektion" ref={ref}>
      <h2>{title}</h2>
      <div
        className="buecher-grid"
        style={{ minHeight: status === "idle" ? 320 : undefined }}
      >
        {status === "loading" && (
          <>
            <span className="visually-hidden" role="status">
              Bücher werden geladen
            </span>
            {Array.from({ length: 8 }, (_, index) => (
              <div className="buecher-card skeleton-card" key={index} aria-hidden="true">
                <div className="skeleton skeleton-cover" />
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line short" />
              </div>
            ))}
          </>
        )}
        {status === "error" && (
          <div role="alert">
            <p>Die Bücher konnten nicht geladen werden.</p>
            <button type="button" className="btn btn-primary" onClick={retry}>
              Erneut versuchen
            </button>
          </div>
        )}
        {status === "ok" && books.length === 0 && <p>Keine Bücher gefunden.</p>}
        {books.map((book) => (
          <BookCard key={book.key} book={book} />
        ))}
      </div>
    </section>
  );
}