import { Link, useParams } from "react-router-dom";
import { useBook } from "../hooks/useBook";
import { formatPrice } from "../lib/price";

export default function BookDetail() {
  const { key } = useParams();
  const { status, book } = useBook(key);

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
          <img id="detail-cover" src={book.cover} alt={`Cover von ${book.title}`} />
        </div>

        <div className="product-info-container">
          <span className="detail-author">{book.author}</span>
          <h1 className="detail-title">{book.title}</h1>

          <div className="detail-price-box">
            <span className="detail-price">{formatPrice(book.price)}</span>
            <span className="stock-status">✓ Auf Lager</span>
          </div>
        </div>
      </div>
    </main>
  );
}