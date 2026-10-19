import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { readJSON, writeJSON } from "../lib/storage";
import { hashPassword } from "../lib/auth";

const USERS_KEY = "bookforge_users";
const SESSION_KEY = "bookforge_logged_in_user";

const AuthContext = createContext(null);

// Beim Login wandern Gast-Warenkorb und Gast-Merkliste ins Konto
function mergeGuestData(username) {
  const guestCart = readJSON("bookforge_cart_guest");
  if (guestCart.length > 0) {
    const cartKey = `bookforge_cart_${username}`;
    const userCart = readJSON(cartKey);
    guestCart.forEach((item) => {
      const existing = userCart.find((entry) => entry.key === item.key);
      if (existing) existing.quantity += item.quantity || 1;
      else userCart.push(item);
    });
    writeJSON(cartKey, userCart);
    localStorage.removeItem("bookforge_cart_guest");
  }

  const guestWishlist = readJSON("bookforge_wishlist_guest");
  if (guestWishlist.length > 0) {
    const wishlistKey = `bookforge_wishlist_${username}`;
    const userWishlist = readJSON(wishlistKey);
    guestWishlist.forEach((book) => {
      if (!userWishlist.some((entry) => entry.key === book.key)) {
        userWishlist.push(book);
      }
    });
    writeJSON(wishlistKey, userWishlist);
    localStorage.removeItem("bookforge_wishlist_guest");
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => localStorage.getItem(SESSION_KEY));

  const register = useCallback(async (username, email, password) => {
    const name = username.trim();
    const mail = email.trim();
    const users = readJSON(USERS_KEY);

    const exists = users.some(
      (account) =>
        account.username.toLowerCase() === name.toLowerCase() ||
        account.email.toLowerCase() === mail.toLowerCase(),
    );
    if (exists) {
      return {
        ok: false,
        error: "Benutzername oder E-Mail ist bereits vergeben.",
      };
    }

    users.push({
      username: name,
      email: mail,
      password: await hashPassword(name, password),
    });
    writeJSON(USERS_KEY, users);
    return { ok: true };
  }, []);

  const login = useCallback(async (identifier, password) => {
    const input = identifier.trim().toLowerCase();
    const users = readJSON(USERS_KEY);
    const account = users.find(
      (entry) =>
        entry.username.toLowerCase() === input ||
        entry.email.toLowerCase() === input,
    );
    const failed = { ok: false, error: "Ungültige Anmeldedaten." };
    if (!account) return failed;

    const hash = await hashPassword(account.username, password);
    // Altes Klartext-Konto: gespeichertes Passwort ist kein SHA-256-Hash (64 Hex-Zeichen)
    const isLegacy =
      !/^[0-9a-f]{64}$/.test(account.password) && account.password === password;
    if (account.password !== hash && !isLegacy) return failed;

    if (isLegacy) {
      account.password = hash;
      writeJSON(USERS_KEY, users);
    }

    mergeGuestData(account.username);
    localStorage.setItem(SESSION_KEY, account.username);
    setUser(account.username);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

    const getEmail = useCallback(() => {
    const account = readJSON(USERS_KEY).find((entry) => entry.username === user);
    return account?.email ?? "";
  }, [user]);

  const updateAccount = useCallback(
    async ({ email, newPassword }) => {
      const users = readJSON(USERS_KEY);
      const account = users.find((entry) => entry.username === user);
      if (!account) return { ok: false, error: "Konto nicht gefunden." };

      const mail = email.trim();
      const taken = users.some(
        (entry) =>
          entry !== account && entry.email.toLowerCase() === mail.toLowerCase(),
      );
      if (taken) return { ok: false, error: "Diese E-Mail ist bereits vergeben." };

      account.email = mail;
      if (newPassword) {
        account.password = await hashPassword(account.username, newPassword);
      }
      writeJSON(USERS_KEY, users);
      return { ok: true };
    },
    [user],
  );

  const value = useMemo(
    () => ({ user, register, login, logout, getEmail, updateAccount }),
    [user, register, login, logout, getEmail, updateAccount],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth braucht einen AuthProvider");
  return context;
}
