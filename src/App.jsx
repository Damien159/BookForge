import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import CheckoutLayout from "./components/CheckoutLayout";
import Home from "./pages/Home";
import BookDetail from "./pages/BookDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<CheckoutLayout />}>
        <Route path="checkout" element={<Checkout />} />
      </Route>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="buch/:key" element={<BookDetail />} />
        <Route path="warenkorb" element={<Cart />} />
        <Route path="merkliste" element={<Wishlist />} />
        <Route path="profil" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
