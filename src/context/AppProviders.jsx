import { AuthProvider, useAuth } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { WishlistProvider } from "./WishlistContext";

// Der key baut Warenkorb und Merkliste beim Login/Logout neu auf,
// dadurch lesen sie sofort den Speicher des richtigen Benutzers.
function UserScopedProviders({ children }) {
  const { user } = useAuth();
  const scope = user ?? "guest";

  return (
    <CartProvider key={`cart-${scope}`}>
      <WishlistProvider key={`wishlist-${scope}`}>{children}</WishlistProvider>
    </CartProvider>
  );
}

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <UserScopedProviders>{children}</UserScopedProviders>
    </AuthProvider>
  );
}