import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { NAV_MENU } from "../data/navigation";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/price";
import ProfileMenu from "./ProfileMenu";

export default function Header() {
  const [params] = useSearchParams();
  const urlQuery = params.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);
  const [shownUrlQuery, setShownUrlQuery] = useState(urlQuery);

  // Ändert sich die Adresse (Kachel, Menü, Zurück-Taste), folgt das Suchfeld
  if (urlQuery !== shownUrlQuery) {
    setShownUrlQuery(urlQuery);
    setQuery(urlQuery);
  }
  const navigate = useNavigate();
  const { count: wishlistCount } = useWishlist();
  const { count: cartCount, total: cartTotal } = useCart();

  function handleSearch(event) {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed) navigate(`/?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <header>
      <div className="top-bar">
        <div className="top-bar-left">
          <a href="#">Buchhandlungen</a>
          <a href="#">Veranstaltungen</a>
        </div>
        <div className="top-bar-center">
          <span>
            <strong>Kostenloser Versand</strong> ab EUR 20,00*
          </span>
        </div>
        <div className="top-bar-right">
          <a href="#">Telefonische Buchberatung</a>
        </div>
      </div>

      <div className="main-header">
        <Link to="/" className="logo">
          BookForge
        </Link>

        <form className="search-container" role="search" onSubmit={handleSearch}>
          <select className="category-select" aria-label="Kategorie">
            <option>Alle Produkte</option>
            <option>Bücher</option>
            <option>E-Books</option>
            <option>Spiele</option>
          </select>
          <input
            type="text"
            placeholder="Titel, Autor, ISBN..."
            aria-label="Suche"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit" className="search-button">
            suchen
          </button>
        </form>

        <nav className="user-navigation" aria-label="Benutzermenü">
          <ul>
            <li>
              <Link to="/merkliste">
                <img src="/svg/Heart.svg" alt="Merkliste" className="header-svg-icon" />
                <span>
                  Merkliste{" "}
                  {wishlistCount > 0 && (
                    <span className="nav-counter">{wishlistCount}</span>
                  )}
                </span>
              </Link>
            </li>
            <li>
              <Link to="/warenkorb">
                <img src="/svg/Buy-Cart.svg" alt="Warenkorb" className="header-svg-icon" />
                <span>
                  Warenkorb{" "}
                  {cartCount > 0 && <span className="nav-counter">{cartCount}</span>}{" "}
                  <span className="nav-price">{formatPrice(cartTotal)}</span>
                </span>
              </Link>
            </li>
            <ProfileMenu />
          </ul>
        </nav>
      </div>

      <nav className="dropdown-navigation" aria-label="Kategorien">
        <ul className="nav-link">
          {NAV_MENU.map((menu) => (
            <li className="dropdown" key={menu.label}>
              <a href="#" onClick={(event) => event.preventDefault()}>
                {menu.label}
              </a>
              <div className="dropdown-content">
                {menu.items.map((item) => (
                  <Link key={item.label} to={`/?q=${encodeURIComponent(item.query)}`}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}