import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { readJSON, writeJSON } from "../lib/storage";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

const loadBooks = (storageKey) =>
  readJSON(storageKey).filter((book) => book && book.key);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const storageKey = `bookforge_wishlist_${user ?? "guest"}`;
  const [books, setBooks] = useState(() => loadBooks(storageKey));

  useEffect(() => {
    function handleStorage(event) {
      if (event.key === storageKey) setBooks(loadBooks(storageKey));
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [storageKey]);

  const save = useCallback(
    (next) => {
      setBooks(next);
      writeJSON(storageKey, next);
    },
    [storageKey],
  );

  const toggle = useCallback(
    (book) => {
      const exists = books.some((entry) => entry.key === book.key);
      save(
        exists
          ? books.filter((entry) => entry.key !== book.key)
          : [
              ...books,
              {
                key: book.key,
                title: book.title,
                author: book.author,
                cover: book.cover,
                price: book.price,
              },
            ],
      );
    },
    [books, save],
  );

  const remove = useCallback(
    (key) => save(books.filter((entry) => entry.key !== key)),
    [books, save],
  );

  const has = useCallback(
    (key) => books.some((entry) => entry.key === key),
    [books],
  );

  const value = useMemo(
    () => ({ books, count: books.length, toggle, remove, has }),
    [books, toggle, remove, has],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist braucht einen WishlistProvider");
  return context;
}