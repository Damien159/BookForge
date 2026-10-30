import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import BackToTop from "./BackToTop";

export default function Layout() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Zum Inhalt springen
      </a>
      <a href="#main-content" className="skip-link">
        Zum Inhalt springen
      </a>
      <Header />
      <div id="main-content" tabIndex={-1} />
      <div id="main-content" tabIndex={-1} />
      <Outlet />
      <Footer />
      <BackToTop />
    </>
  );
}