import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import CheckoutLayout from "./components/CheckoutLayout";
import Home from "./pages/Home";
const BookDetail = lazy(() => import("./pages/BookDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
        <Suspense fallback={<p style={{ padding: 40 }}>Seite wird geladen...</p>}>
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
    </Suspense>
  );
}
