import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Plus } from 'lucide-react';
import SafeImage from './SafeImage';
import PriceDisplay from './PriceDisplay';
import { useStore } from '../context/StoreContext';
import './ProductCard.css';
export default function ProductCard({ product: p }) {
  const { wish, toggleWish, addToCart } = useStore();
  const [pick, setPick] = useState(false);
  const liked = wish.includes(p.id);
  const quick = (size) => { addToCart(p, { size, color: p.colors[0].name }); setPick(false); };
  return (
    <article className="card">
      <div className="card-img">
        <Link to={`/product/${p.id}`} aria-label={p.name}><SafeImage src={p.images[0]} alt={p.name} /></Link>
        {p.mrp > p.price && <span className="sale-tag">Sale</span>}
        <button className={`wish ${liked ? 'on' : ''}`} onClick={() => toggleWish(p.id)} aria-pressed={liked} aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}><Heart size={18} fill={liked ? 'currentColor' : 'none'} /></button>
        {pick ? (
          <div className="quick-sizes" role="group" aria-label="Choose size">{p.sizes.map((s) => <button key={s} onClick={() => quick(s)}>{s}</button>)}</div>
        ) : (
          <button className="quick" onClick={() => (p.sizes.length === 1 ? quick(p.sizes[0]) : setPick(true))}><Plus size={16} /> Quick add</button>
        )}
      </div>
      <div className="card-body">
        <Link to={`/product/${p.id}`}><h3>{p.name}</h3></Link>
        <p className="rate"><Star size={14} fill="#F97316" stroke="#F97316" /> {p.rating} <span>({p.reviews})</span></p>
        <PriceDisplay price={p.price} mrp={p.mrp} />
        <div className="dots">{p.colors.map((c) => <i key={c.name} title={c.name} style={{ background: c.hex }} />)}</div>
      </div>
    </article>
  );
}
