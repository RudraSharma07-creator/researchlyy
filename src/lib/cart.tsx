import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { addToSelection, removeFromSelection, selectionTotal } from "@/lib/cart-logic";
import { itemById, type CatalogItem } from "@/lib/catalog";

const STORAGE_KEY = "researchly.cart.v1";

type CartContextValue = {
  ids: string[];
  items: CatalogItem[];
  total: number;
  count: number;
  has: (id: string) => boolean;
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  clear: () => void;
  popupOpen: boolean;
  setPopupOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setIds(parsed.filter((id) => typeof id === "string" && itemById(id)));
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids, hydrated]);

  const add = useCallback((id: string) => setIds((prev) => addToSelection(prev, id)), []);
  const remove = useCallback((id: string) => setIds((prev) => removeFromSelection(prev, id)), []);
  const toggle = useCallback(
    (id: string) => setIds((prev) => (prev.includes(id) ? removeFromSelection(prev, id) : addToSelection(prev, id))),
    [],
  );
  const clear = useCallback(() => setIds([]), []);

  const value = useMemo<CartContextValue>(() => {
    const items = ids.map((id) => itemById(id)).filter((x): x is CatalogItem => Boolean(x));
    return {
      ids,
      items,
      total: selectionTotal(ids),
      count: ids.length,
      has: (id) => ids.includes(id),
      add,
      remove,
      toggle,
      clear,
      popupOpen,
      setPopupOpen,
    };
  }, [ids, add, remove, toggle, clear, popupOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
