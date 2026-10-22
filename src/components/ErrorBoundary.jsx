import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unerwarteter Fehler:", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="cart-page-container">
        <h1 className="cart-page-title">Etwas ist schiefgelaufen</h1>
        <p>Bitte lade die Seite neu. Deine Daten im Warenkorb bleiben erhalten.</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Seite neu laden
        </button>
      </main>
    );
  }
}