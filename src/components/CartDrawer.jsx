import { Link } from 'react-router-dom';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import SafeImage from './SafeImage';
import { inr } from './PriceDisplay';
import './CartDrawer.css';
export default function CartDrawer() {
  const { drawerOpen, setDrawerOpen, lines, setQty, removeItem, subtotal, discount, shipping, total, code, setCode } = useStore();
  const close = () => setDrawerOpen(false);
  return (
    <>
      <div className={`scrim ${drawerOpen ? 'show' : ''}`} onClick={close} />
      <aside className={`drawer ${drawerOpen ? 'open' : ''}`} aria-label="Shopping cart" aria-hidden={!drawerOpen}>
        <header><h2>Your cart</h2><button className="icon-btn" onClick={close} aria-label="Close cart"><X /></button></header>
        {lines.length === 0 ? (
          <div className="empty"><ShoppingBag size={42} /><h3>Your cart is empty</h3><p>Find something you love and we'll keep it here.</p><Link to="/shop" className="btn primary" onClick={close}>Start shopping</Link></div>
        ) : (
          <>
            <ul className="lines">
              {lines.map((l) => (
                <li key={l.key}>
                  <SafeImage src={l.product.images[0]} alt={l.product.name} />
                  <div>
                    <Link to={`/product/${l.product.id}`} onClick={close}><b>{l.product.name}</b></Link>
                    <small>{l.size} · {l.color}</small>
                    <div className="qty sm"><button onClick={() => setQty(l.key, l.qty - 1)} aria-label="Decrease"><Minus size={14} /></button><span>{l.qty}</span><button onClick={() => setQty(l.key, l.qty + 1)} aria-label="Increase"><Plus size={14} /></button></div>
                  </div>
                  <div className="line-r"><b>{inr(l.product.price * l.qty)}</b><button className="icon-btn" onClick={() => removeItem(l.key)} aria-label={`Remove ${l.product.name}`}><Trash2 size={17} /></button></div>
                </li>
              ))}
            </ul>
            <div className="drawer-foot">
              <label className="code">Discount code<input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Try FIT10" /></label>
              <dl className="sum"><dt>Subtotal</dt><dd>{inr(subtotal)}</dd>{discount > 0 && <><dt>Discount</dt><dd>−{inr(discount)}</dd></>}<dt>Est. shipping</dt><dd>{shipping ? inr(shipping) : 'Free'}</dd><dt className="tot">Total</dt><dd className="tot">{inr(total)}</dd></dl>
              <Link to="/checkout" className="btn primary block" onClick={close}>Proceed to checkout</Link>
              <button className="btn ghost block" onClick={close}>Continue shopping</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
