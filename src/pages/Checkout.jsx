import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const EMPTY_ADDRESS = {
  firstname: "",
  lastname: "",
  street: "",
  zip: "",
  city: "",
};

export default function Checkout() {
  const { items } = useCart();
  const [address, setAddress] = useState(EMPTY_ADDRESS);

  function handleChange(event) {
    setAddress({ ...address, [event.target.name]: event.target.value });
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

      <form className="checkout-form-grid">
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
      </form>
    </main>
  );
}