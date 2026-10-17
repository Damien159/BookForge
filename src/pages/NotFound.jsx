import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="cart-page-container">
      <h1 className="cart-page-title">Seite nicht gefunden</h1>
      <p>
        <Link to="/">Zurück zur Startseite</Link>
      </p>
    </main>
  );
}