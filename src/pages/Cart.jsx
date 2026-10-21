import { Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/price";

export default function Cart() {
  useDocumentTitle("Warenkorb");
  const { items, total, changeQuantity, removeItem } = useCart();

  return (
    <main className="cart-page-container">
      <h1 className="cart-page-title">Dein Warenkorb</h1>

      {items.length === 0 ? (
        <div className="empty-message">
          <h2>Dein Warenkorb ist leer.</h2>
          <p>
            Stöbere in unserem Sortiment und füge deine Lieblingsbücher hinzu!
          </p>
          <Link to="/">Zurück zur Startseite</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items-list">
            {items.map((item) => (
              <div className="cart-item" key={item.key}>
                <div className="cart-item-info">
                  <div>
                    <h3 className="cart-item-title">
                      <Link to={`/buch/${item.key}`}>{item.title}</Link>
                    </h3>
                    <div className="cart-item-price">
                      {formatPrice(item.price)}
                    </div>
                  </div>
                </div>

                <div className="cart-item-controls">
                  <div className="quantity-control">
                    <button
                      type="button"
                      className="quantity-btn"
                      onClick={() => changeQuantity(item.key, -1)}
                      aria-label="Menge verringern"
                    >
                      -
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      type="button"
                      className="quantity-btn"
                      onClick={() => changeQuantity(item.key, 1)}
                      aria-label="Menge erhöhen"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeItem(item.key)}
                    title="Entfernen"
                    aria-label="Aus dem Warenkorb entfernen"
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="cart-summary">
            <h3>Zusammenfassung</h3>
            <div className="summary-row">
              <span>Zwischensumme</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="summary-row">
              <span>Versandkosten</span>
              <span>Kostenlos</span>
            </div>
            <div className="summary-row total">
              <span>Gesamtsumme</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Link to="/checkout" className="checkout-btn">
              Zur Kasse gehen
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
