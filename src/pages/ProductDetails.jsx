import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Minus, Plus, Heart, Ruler, Star, Truck } from 'lucide-react';
import { products, reviews } from '../data/products';
import { useStore } from '../context/StoreContext';
import SafeImage from '../components/SafeImage';
import PriceDisplay from '../components/PriceDisplay';
import SizeSelector from '../components/SizeSelector';
import Modal from '../components/Modal';
import FitMatchModal from '../components/FitMatchModal';
import { SizeChart } from '../components/FitMatch';
import ProductGrid from '../components/ProductGrid';
import './ProductDetails.css';
export default function ProductDetails() {
  const { id } = useParams();
  const p = products.find((x) => x.id === +id);
  const nav = useNavigate();
  const { addToCart, wish, toggleWish } = useStore();
  const [img, setImg] = useState(0);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState('');
  const [modal, setModal] = useState('');
  if (!p) return <div className="container empty page"><h1>Product not found</h1><Link to="/shop" className="btn primary">Back to shop</Link></div>;
  const single = p.sizes.length === 1;
  const submit = (go) => {
    const s = single ? p.sizes[0] : size;
    if (!s || !color) return setErr(`Please select ${!s ? 'a size' : ''}${!s && !color ? ' and ' : ''}${!color ? 'a color' : ''}.`);
    setErr(''); addToCart(p, { size: s, color, qty }); if (go) nav('/checkout');
  };
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  return (
    <div className="container pdp">
      <div className="gallery"><div className="main-img"><SafeImage src={p.images[img]} alt={`${p.name} view ${img + 1}`} /></div>
        <div className="thumbs">{p.images.map((s, i) => <button key={i} className={i === img ? 'on' : ''} onClick={() => setImg(i)} aria-label={`View image ${i + 1}`}><SafeImage src={s} alt="" /></button>)}</div></div>
      <div className="info">
        <h1>{p.name}</h1>
        <p className="rate"><Star size={15} fill="#F97316" stroke="#F97316" /> {p.rating} <span>({p.reviews} reviews)</span></p>
        <PriceDisplay price={p.price} mrp={p.mrp} />
        <p>{p.description}</p>
        <h3>Color: {color || 'Select'}</h3>
        <div className="chips">{p.colors.map((c) => <button key={c.name} className={`swatch ${color === c.name ? 'on' : ''}`} style={{ background: c.hex }} onClick={() => setColor(c.name)} aria-label={c.name} aria-pressed={color === c.name} />)}</div>
        {!single && <><div className="size-head"><h3>Size: {size || 'Select'}</h3><button className="link" onClick={() => setModal('chart')}>Size guide</button></div>
          <SizeSelector sizes={p.sizes} value={size} onChange={setSize} error={!!err} />
          {p.kind !== 'accessory' && <button className="btn fm" onClick={() => setModal('fit')}><Ruler size={16} /> FitMatch: find my size</button>}</>}
        <h3>Quantity</h3>
        <div className="qty"><button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease"><Minus size={16} /></button><span>{qty}</span><button onClick={() => setQty(Math.min(10, qty + 1))} aria-label="Increase"><Plus size={16} /></button></div>
        {err && <p className="error" role="alert">{err}</p>}
        <div className="row"><button className="btn primary lg" onClick={() => submit(false)}>Add to cart</button><button className="btn dark lg" onClick={() => submit(true)}>Buy now</button>
          <button className={`btn ghost wish-btn ${wish.includes(p.id) ? 'on' : ''}`} onClick={() => toggleWish(p.id)} aria-label="Toggle wishlist"><Heart fill={wish.includes(p.id) ? 'currentColor' : 'none'} /></button></div>
        <div className="facts"><p><Truck size={16} /> Delivery in 3–6 working days. Free over ₹1,999.</p><details open><summary>Details &amp; material</summary><p>{p.material}</p></details><details><summary>Returns</summary><p>14-day easy returns on unworn items with tags.</p></details></div>
      </div>
      <section className="reviews-sec"><h2>Customer reviews</h2><div className="reviews">{reviews.map((r) => <blockquote key={r.name}><p>{r.text}</p><footer>{r.name} · {r.rating}★</footer></blockquote>)}</div></section>
      <section className="reviews-sec"><h2>You may also like</h2><ProductGrid items={related} /></section>
      {modal === 'chart' && <Modal title="Size guide" onClose={() => setModal('')}><SizeChart type={p.kind === 'footwear' ? 'footwear' : 'clothing'} /></Modal>}
      {modal === 'fit' && <FitMatchModal product={p} onClose={() => setModal('')} onApply={(s) => { setSize(s); setModal(''); }} />}
    </div>
  );
}
