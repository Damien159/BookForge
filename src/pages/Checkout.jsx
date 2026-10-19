import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { addOrder, createOrderId } from "../lib/orders";
import { formatPrice, getShipping } from "../lib/price";

const EMPTY_ADDRESS = {
  firstname: "",
  lastname: "",
  street: "",
  zip: "",
  city: "",
};

export default function Checkout() {
  const { user } = useAuth();
  const { items, total, clear } = useCart();
  const shipping = getShipping(total);
  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const [payment, setPayment] = useState("PayPal");
  const [placedOrder, setPlacedOrder] = useState(null);

  function handleChange(event) {
    setAddress({ ...address, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (items.length === 0) return;

    const order = {
      id: createOrderId(),
      date: new Date().toLocaleDateString("de-DE"),
      items: items.map(({ key, title, price, quantity }) => ({
        key,
        title,
        price,
        quantity,
      })),
      subtotal: total,
      shipping,
      total: total + shipping,
      payment,
      address,
      status: "Wird bearbeitet",
    };

    addOrder(user, order);
    clear();
    setPlacedOrder(order);
  }

  if (placedOrder) {
    return (
      <main className="checkout-page-container">
        <h1 className="checkout-title">Vielen Dank für deine Bestellung!</h1>
        <div className="checkout-card">
          <p>
            Deine Bestellnummer: <strong>{placedOrder.id}</strong>
          </p>
          <p>
            Gesamtbetrag: {formatPrice(placedOrder.total)} (
            {placedOrder.payment})
          </p>
          <p>
            {user ? (
              <Link to="/profil">Zu deinen Bestellungen</Link>
            ) : (
              <Link to="/">Weiter einkaufen</Link>
            )}
          </p>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="checkout-page-container">
        <h1 className="checkout-title">Kasse &amp; Bestellung abschließen</h1>
        <div className="empty-message">
          <h2>Dein Warenkorb ist leer.</h2>
          <Link to="/">Zurück zur Startseite</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page-container">
      <h1 className="checkout-title">Kasse &amp; Bestellung abschließen</h1>

      <form className="checkout-form-grid" onSubmit={handleSubmit}>
        <section className="checkout-card">
          <h3>1. Lieferadresse</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="shipping-firstname">Vorname</label>
              <input
                id="shipping-firstname"
                name="firstname"
                type="text"
                autoComplete="given-name"
                value={address.firstname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="shipping-lastname">Nachname</label>
              <input
                id="shipping-lastname"
                name="lastname"
                type="text"
                autoComplete="family-name"
                value={address.lastname}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="shipping-street">Straße &amp; Hausnummer</label>
            <input
              id="shipping-street"
              name="street"
              type="text"
              autoComplete="street-address"
              value={address.street}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row-small">
            <div className="form-group">
              <label htmlFor="shipping-zip">PLZ</label>
              <input
                id="shipping-zip"
                name="zip"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{4,5}"
                title="4 bis 5 Ziffern"
                autoComplete="postal-code"
                value={address.zip}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="shipping-city">Stadt</label>
              <input
                id="shipping-city"
                name="city"
                type="text"
                autoComplete="address-level2"
                value={address.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </section>

        <section className="checkout-card">
          <h3>2. Zahlungsart</h3>
          <div className="payment-options">
            {["PayPal", "Kreditkarte"].map((method) => (
              <label key={method}>
                <input
                  type="radio"
                  name="payment"
                  value={method}
                  checked={payment === method}
                  onChange={(event) => setPayment(event.target.value)}
                />{" "}
                {method}
              </label>
            ))}
          </div>
        </section>

        <section className="checkout-card checkout-summary-box">
          <div>
            <div>Zwischensumme: {formatPrice(total)}</div>
            <div>
              Versand: {shipping === 0 ? "Kostenlos" : formatPrice(shipping)}
            </div>
            <div>
              <span>Gesamtbetrag: </span>
              <strong>{formatPrice(total + shipping)}</strong>
            </div>
          </div>
          <button type="submit" className="btn-primary">
            Kostenpflichtig bestellen
          </button>
        </section>
      </form>
    </main>
  );
}
