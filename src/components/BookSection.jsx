import { useEffect, useRef, useState } from "react";
import { useBooks } from "../hooks/useBooks";
import BookCard from "./BookCard";

export default function BookSection({ id, title, query, eager = false }) {
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

  const { status, books } = useBooks(visible ? query : null);

  return (
    <section id={id} className="buecher-sektion" ref={ref}>
      <h2>{title}</h2>
      <div
        className="buecher-grid"
        style={{ minHeight: status === "idle" ? 320 : undefined }}
      >
        {status === "loading" && <p>Bücher werden geladen...</p>}
        {status === "error" && <p>Fehler beim Laden der Buchdaten.</p>}
        {status === "ok" && books.length === 0 && <p>Keine Bücher gefunden.</p>}
        {books.map((book) => (
          <BookCard key={book.key} book={book} />
        ))}
      </div>
    </section>
  );
}