import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/price";

export default function Cart() {
  const { items } = useCart();

  return (
    <main className="cart-page-container">
      <h1 className="cart-page-title">Dein Warenkorb</h1>

      {items.length === 0 ? (
        <div className="empty-message">
          <h2>Dein Warenkorb ist leer.</h2>
          <p>Stöbere in unserem Sortiment und füge deine Lieblingsbücher hinzu!</p>
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
                    <div className="cart-item-price">{formatPrice(item.price)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}