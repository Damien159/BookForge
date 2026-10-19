import { Link, Outlet } from "react-router-dom";
import Footer from "./Footer";

export default function CheckoutLayout() {
  return (
    <>
      <header>
        <div className="top-bar" style={{ justifyContent: "center" }}>
          <span>
            <strong>Kostenloser Versand</strong> ab EUR 20,00*
          </span>
        </div>
        <div className="main-header">
          <Link to="/" className="logo">
            BookForge
          </Link>
          <nav className="user-navigation" aria-label="Kasse">
            <ul>
              <li>
                <Link to="/warenkorb">
                  <img
                    src="/svg/Buy-Cart.svg"
                    alt=""
                    className="header-svg-icon"
                  />
                  <span>Zurück zum Warenkorb</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <Outlet />
      <Footer />
    </>
  );
}