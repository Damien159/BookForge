import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useBook } from "../hooks/useBook";
import Reviews from "../components/Reviews";
import { formatPrice } from "../lib/price";

export default function BookDetail() {
  const { key } = useParams();
  const { status, book } = useBook(key);
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const [added, setAdded] = useState(false);
  const liked = has(key);

  // Der Timer wird aufgeräumt, falls die Seite vorher verlassen wird
  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 800);
    return () => clearTimeout(timer);
  }, [added]);

  useEffect(() => {
    if (!book) return;
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content");

    document.title = `${book.title} | BookForge`;
    meta?.setAttribute(
      "content",
      `${book.title} von ${book.author}. ${book.description}`
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 155),
    );

    return () => {
      document.title = "BookForge | Bücher online kaufen";
      if (meta && previousDescription !== null) {
        meta.setAttribute("content", previousDescription);
      }
    };
  }, [book]);

  function handleAdd() {
    addItem(book);
    setAdded(true);
  }

  if (status === "loading") {
    return (
      <main className="product-detail-container">
        <p>Buch wird geladen...</p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="product-detail-container">
        <h1 className="detail-title">Buch nicht gefunden</h1>
        <p>
          <Link to="/">Zurück zur Startseite</Link>
        </p>
      </main>
    );
  }

  return (
    <main className="product-detail-container">
      <div className="product-main-info">
        <div className="product-cover-container">
          <img
            id="detail-cover"
            src={book.cover}
            alt={`Cover von ${book.title}`}
          />
        </div>

        <div className="product-info-container">
          <span className="detail-author">{book.author}</span>
          <h1 className="detail-title">{book.title}</h1>

          <div className="detail-price-box">
            <span className="detail-price">{formatPrice(book.price)}</span>
            <span className="stock-status">✓ Auf Lager</span>
          </div>

          <div className="detail-actions">
            <button
              type="button"
              className={`cart-btn${added ? " added" : ""}`}
              onClick={handleAdd}
            >
              <img src="/svg/Buy-Cart.svg" alt="" className="svg-icon" />
              In den Warenkorb
            </button>
            <button
              type="button"
              className={`fav-btn${liked ? " active" : ""}`}
              onClick={() => toggle(book)}
              aria-label={
                liked
                  ? "Von der Merkliste entfernen"
                  : "Zur Merkliste hinzufügen"
              }
              aria-pressed={liked}
            >
              <img src="/svg/Heart.svg" alt="" className="svg-icon" />
            </button>
          </div>
        </div>
      </div>

      <section className="product-description-section">
        <h2>Beschreibung</h2>
        <p className="description-text">{book.description}</p>
      </section>

      <Reviews key={book.key} bookKey={book.key} />
    </main>
  );
}
