import { Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function NotFound() {
  useDocumentTitle("Seite nicht gefunden");
  return (
    <main className="cart-page-container">
      <h1 className="cart-page-title">Seite nicht gefunden</h1>
      <p>
        <Link to="/">Zurück zur Startseite</Link>
      </p>
    </main>
  );
}