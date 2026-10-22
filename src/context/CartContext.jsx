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
import { MAX_QUANTITY } from "../lib/limits";

const CartContext = createContext(null);

const loadItems = (storageKey) =>
  readJSON(storageKey).filter((item) => item && item.key);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const storageKey = `bookforge_cart_${user ?? "guest"}`;
  const [items, setItems] = useState(() => loadItems(storageKey));

  // Änderungen aus anderen Tabs übernehmen
  useEffect(() => {
    function handleStorage(event) {
      if (event.key === storageKey) setItems(loadItems(storageKey));
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [storageKey]);

  const save = useCallback(
    (next) => {
      setItems(next);
      writeJSON(storageKey, next);
    },
    [storageKey],
  );

  const addItem = useCallback(
    (book) => {
      const exists = items.some((item) => item.key === book.key);
      save(
        exists
          ? items.map((item) =>
              item.key === book.key ? { ...item, quantity: Math.min(MAX_QUANTITY, item.quantity + 1)} : item,
            )
          : [
              ...items,
              {
                key: book.key,
                title: book.title,
                author: book.author,
                cover: book.cover,
                price: book.price,
                quantity: 1,
              },
            ],
      );
    },
    [items, save],
  );

  const changeQuantity = useCallback(
    (key, delta) => {
      save(
        items
          .map((item) =>
            item.key === key ? { ...item, quantity: Math.min(MAX_QUANTITY, item.quantity + delta) } : item,
          )
          .filter((item) => item.quantity > 0),
      );
    },
    [items, save],
  );

  const removeItem = useCallback(
    (key) => save(items.filter((item) => item.key !== key)),
    [items, save],
  );

  const clear = useCallback(() => save([]), [save]);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      addItem,
      changeQuantity,
      removeItem,
      clear,
    }),
    [items, addItem, changeQuantity, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart braucht einen CartProvider");
  return context;
}