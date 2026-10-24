import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatPrice } from "../lib/price";

export default function BookCard({ book }) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const [added, setAdded] = useState(false);
  const liked = has(book.key);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 800);
    return () => clearTimeout(timer);
  }, [added]);

  function handleAdd() {
    addItem(book);
    setAdded(true);
  }

  return (
    <div className="buecher-card">
      <button
        type="button"
        className={`fav-btn${liked ? " active" : ""}`}
        onClick={() => toggle(book)}
        aria-label={
          liked ? "Von der Merkliste entfernen" : "Zur Merkliste hinzufügen"
        }
        aria-pressed={liked}
      >
        <img src="/svg/Heart.svg" alt="" className="svg-icon" />
      </button>

      <Link to={`/buch/${book.key}`} className="book-card-link">
        <img
          src={book.cover}
          alt={`Cover von ${book.title}`}
          width="140"
          height="210"
          loading="lazy"
          decoding="async"
        />
        <h3>{book.title}</h3>
        <p>{book.author}</p>
      </Link>

      <div className="card-footer">
        <p className="price">{formatPrice(book.price)}</p>
        <button
          type="button"
          className={`cart-btn${added ? " added" : ""}`}
          onClick={handleAdd}
          aria-label="In den Warenkorb"
        >
          <img src="/svg/Buy-Cart.svg" alt="" className="svg-icon" />
        </button>
      </div>
    </div>
  );
}
