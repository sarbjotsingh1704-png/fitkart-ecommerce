import { Link } from 'react-router-dom';
import { Ruler, Star, Truck, RefreshCw, ShieldCheck, ArrowRight, Sparkles, UserRound } from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import SafeImage from '../components/SafeImage';
import { products, CATEGORIES, reviews } from '../data/products';
import { useStore } from '../context/StoreContext';
import { useState } from 'react';
import './Home.css';
import heroRack from '../assets/fitkart-hero-rack.jpg';
const catImg = { men: 1, women: 4, shoes: 8, accessories: 12 };
const Section = ({ title, to, items }) => (
  <section className="container section"><div className="sec-head"><h2>{title}</h2><Link to={to}>View all</Link></div><ProductGrid items={items} /></section>
);
export default function Home() {
  const { notify } = useStore();
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const subscribe = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr('Enter a valid email address');
    setErr(''); setEmail(''); notify('Thanks for subscribing (demo)');
  };
  return (
    <>
      <section className="hero">
        <div className="container hero-in">
          <div className="hero-copy">
            <span className="hero-kicker">New Collection <Sparkles size={15} /></span>
            <h1>Find Your Fit.<br />Own Your <em>Style.</em></h1>
            <p>Clothing, sneakers and accessories — plus FitMatch, a quick way to pick the right size.</p>
            <div className="hero-actions">
              <Link to="/shop" className="btn primary lg">Shop Now <ArrowRight size={19} /></Link>
              <Link to="/fitmatch" className="btn hero-secondary lg"><UserRound size={19} /> Try FitMatch</Link>
            </div>
            <div className="hero-benefits">
              <div><Truck /><span><b>Free Shipping</b><small>Above ₹999</small></span></div>
              <div><RefreshCw /><span><b>Easy Returns</b><small>within 7 Days</small></span></div>
              <div><ShieldCheck /><span><b>Secure</b><small>Payments</small></span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-visual__accent" />
            <img src={heroRack} alt="A curated rack of new season clothing in neutral tones" />
            <div className="hero-image-caption"><span><b>Latest Styles</b><small>T-Shirts · Hoodies · Shirts · More</small></span><Link to="/shop" aria-label="Explore latest styles"><ArrowRight /></Link></div>
          </div>
        </div>
      </section>
      <section className="container section"><div className="cats">{CATEGORIES.map((c) => <Link key={c.id} to={`/shop?cat=${c.id}`} className="cat"><SafeImage src={products[catImg[c.id]].images[0]} alt={c.label} /><span>{c.label}</span></Link>)}</div></section>
      <Section title="New arrivals" to="/shop?sort=newest" items={products.filter((p) => p.isNew).slice(0, 4)} />
      <section className="fm-banner"><div className="container"><Ruler size={34} /><div><h2>Meet FitMatch</h2><p>Enter a few measurements and get a size suggestion with the reasoning shown. A demo tool based on size charts, not a guarantee.</p></div><Link to="/fitmatch" className="btn primary">Find my size</Link></div></section>
      <Section title="Best sellers" to="/shop?sort=popular" items={products.filter((p) => p.bestSeller).slice(0, 4)} />
      <Section title="Trending now" to="/shop?sort=rating" items={products.filter((p) => p.trending).slice(0, 4)} />
      <section className="container section"><h2>What customers say</h2><div className="reviews">{reviews.map((r) => <blockquote key={r.name}><p className="rate">{[...Array(r.rating)].map((_, i) => <Star key={i} size={14} fill="#F97316" stroke="#F97316" />)}</p><p>{r.text}</p><footer>{r.name}</footer></blockquote>)}</div></section>
      </>
  );
}
