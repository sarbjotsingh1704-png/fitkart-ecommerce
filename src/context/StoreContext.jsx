import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { products } from '../data/products';
const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);
export const DISCOUNT_CODES = { FIT10: 0.1 };
export function StoreProvider({ children }) {
  const [cart, setCart] = useLocalStorage('fitkart_cart', []);
  const [wish, setWish] = useLocalStorage('fitkart_wish', []);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [code, setCode] = useState('');
  const notify = useCallback((m) => { setToast(m); setTimeout(() => setToast(null), 2400); }, []);
  const addToCart = (p, { size, color, qty = 1 }) => {
    const key = `${p.id}-${size}-${color}`;
    setCart((c) => c.find((i) => i.key === key) ? c.map((i) => i.key === key ? { ...i, qty: i.qty + qty } : i) : [...c, { key, id: p.id, size, color, qty }]);
    notify(`${p.name} added to cart`);
  };
  const setQty = (key, qty) => setCart((c) => c.map((i) => i.key === key ? { ...i, qty: Math.max(1, Math.min(10, qty)) } : i));
  const removeItem = (key) => setCart((c) => c.filter((i) => i.key !== key));
  const clearCart = () => { setCart([]); setCode(''); };
  const toggleWish = (id) => { const has = wish.includes(id); setWish((w) => has ? w.filter((x) => x !== id) : [...w, id]); notify(has ? 'Removed from wishlist' : 'Saved to wishlist'); };
  const totals = useMemo(() => {
    const lines = cart.map((i) => ({ ...i, product: products.find((p) => p.id === i.id) })).filter((l) => l.product);
    const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
    const rate = DISCOUNT_CODES[code.trim().toUpperCase()] || 0;
    const discount = Math.round(subtotal * rate);
    const shipping = subtotal === 0 || subtotal >= 1999 ? 0 : 99;
    return { lines, subtotal, discount, shipping, total: subtotal - discount + shipping, count: lines.reduce((s, l) => s + l.qty, 0) };
  }, [cart, code]);
  return <Ctx.Provider value={{ cart, wish, addToCart, setQty, removeItem, clearCart, toggleWish, drawerOpen, setDrawerOpen, toast, notify, code, setCode, ...totals }}>{children}</Ctx.Provider>;
}
