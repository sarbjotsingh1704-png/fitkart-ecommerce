import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { products } from '../data/products';
import { useStore } from '../context/StoreContext';
import SafeImage from '../components/SafeImage';
import PriceDisplay from '../components/PriceDisplay';
export default function Wishlist() {
  const { wish, toggleWish, addToCart } = useStore();
  const items = products.filter((p) => wish.includes(p.id));
  if (!items.length) return <div className="container empty page"><h1>Your wishlist is empty</h1><p>Tap the heart on any product to save it here.</p><Link to="/shop" className="btn primary">Browse products</Link></div>;
  return (
    <div className="container page"><h1>Wishlist</h1>
      <div className="grid">{items.map((p) => (
        <article className="card" key={p.id}><Link to={`/product/${p.id}`} className="card-img"><SafeImage src={p.images[0]} alt={p.name} /></Link>
          <div className="card-body"><h3>{p.name}</h3><PriceDisplay price={p.price} mrp={p.mrp} />
            <div className="row"><button className="btn primary sm" onClick={() => (p.sizes.length === 1 ? addToCart(p, { size: p.sizes[0], color: p.colors[0].name }) : null)} disabled={p.sizes.length > 1}>Add to cart</button>
              {p.sizes.length > 1 && <Link className="btn ghost sm" to={`/product/${p.id}`}>Choose size</Link>}
              <button className="icon-btn" onClick={() => toggleWish(p.id)} aria-label={`Remove ${p.name}`}><Trash2 size={17} /></button></div></div></article>))}</div></div>
  );
}
