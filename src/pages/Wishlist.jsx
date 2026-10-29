import { Link } from "react-router-dom";
import BookCard from "../components/BookCard";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function Wishlist() {
  useDocumentTitle("Merkliste");
  const { books } = useWishlist();
  const { addItems } = useCart();

  return (
    <main className="wishlist-page-container">
     <h1 className="wishlist-page-title">
        Deine Merkliste{books.length > 0 && ` (${books.length})`}
      </h1>
      {books.length > 0 && (
        <div className="wishlist-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => addItems(books)}
          >
            Alle in den Warenkorb
          </button>
        </div>
      )}

      {books.length === 0 ? (
        <div className="empty-message">
          <h2>Deine Merkliste ist noch leer.</h2>
          <p>
            Klicke auf das Herz-Symbol bei Büchern, die dir gefallen, um sie für
            später zu speichern.
          </p>
          <Link to="/">Jetzt Bücher entdecken</Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {books.map((book) => (
            <BookCard key={book.key} book={book} />
          ))}
        </div>
      )}
    </main>
  );
}