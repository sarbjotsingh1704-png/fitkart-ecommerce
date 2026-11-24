import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Shirt, Star, Truck } from 'lucide-react';
import { products } from '../data/products';
import ProductGrid from '../components/ProductGrid';
import FilterSidebar from '../components/FilterSidebar';
import './Shop.css';
import shopBanner from '../assets/shop-banner-apparel.jpg';
const blank = { cat: '', sizes: [], colors: [], maxPrice: 5000, rating: 0, sale: false };
export default function Shop() {
  const [sp, setSp] = useSearchParams();
  const q = (sp.get('q') || '').toLowerCase();
  const [f, setF] = useState({ ...blank, cat: sp.get('cat') || '', sale: sp.get('sale') === '1' });
  const [sort, setSort] = useState(sp.get('sort') || 'popular');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => { setF((o) => ({ ...o, cat: sp.get('cat') || '', sale: sp.get('sale') === '1' })); }, [sp]);
  useEffect(() => { setLoading(true); const t = setTimeout(() => setLoading(false), 350); return () => clearTimeout(t); }, [f, sort, q]);
  const items = useMemo(() => {
    const r = products.filter((p) =>
      (!q || `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(q)) &&
      (!f.cat || p.category === f.cat) && (!f.sale || p.mrp > p.price) &&
      (!f.sizes.length || f.sizes.some((s) => p.sizes.includes(s))) &&
      (!f.colors.length || f.colors.some((c) => p.colors.some((x) => x.name === c))) &&
      p.price <= f.maxPrice && p.rating >= f.rating);
    const s = { popular: (a, b) => b.popularity - a.popularity, newest: (a, b) => b.added - a.added, rating: (a, b) => b.rating - a.rating, low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price }[sort];
    return [...r].sort(s);
  }, [f, sort, q]);
  const reset = () => { setF(blank); setSp({}); };
  return (
    <div className="shop-page">
      <section className="shop-hero">
        <div className="shop-hero__inner">
          <div className="shop-hero__copy">
            <div className="shop-breadcrumb"><a href="/">Home</a><span>›</span><b>Shop</b></div>
            <span className="shop-kicker">THE FITKART COLLECTION</span>
            <h1>{q ? `Results for "${sp.get('q')}"` : 'Shop All'}</h1>
            <p>Discover premium styles for men and women</p>
          </div>
          <div className="shop-hero__photo"><img src={shopBanner} alt="New season apparel collection" /></div>
          <div className="shop-hero__stats" aria-label="Store highlights">
            <div className="shop-stat"><Shirt /><div><strong>4,320+</strong><small>Products</small></div></div>
            <div className="shop-stat"><Star /><div><strong>4.8</strong><small>Avg. Rating</small></div></div>
            <div className="shop-stat"><Truck /><div><strong>Fast</strong><small>Delivery</small></div></div>
          </div>
        </div>
      </section>

      <div className="shop-main container">
        <FilterSidebar f={f} setF={setF} open={open} onClose={() => setOpen(false)} reset={reset} />

        <section className="shop-results">
          <div className="shop-toolbar">
            <div className="shop-toolbar__title-row">
              <h2>{q ? `Search Results` : f.cat ? `${f.cat[0].toUpperCase()}${f.cat.slice(1)}` : "Shop All"}</h2>
              <span>({loading ? '...' : `${items.length} items`})</span>
            </div>

            <div className="shop-toolbar__controls">
              <button className="btn ghost filter-btn" onClick={() => setOpen(true)}><SlidersHorizontal size={16} /> Filters</button>
              <label className="sort">Sort by <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="popular">Popularity</option><option value="newest">Newest</option><option value="rating">Rating</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label>
            </div>
          </div>

          {loading ? <div className="grid">{[...Array(6)].map((_, i) => <div key={i} className="skeleton" />)}</div>
            : items.length ? <ProductGrid items={items} />
            : <div className="empty"><h3>No products found</h3><p>Try removing a filter or searching for something else.</p><button className="btn primary" onClick={reset}>Clear filters</button></div>}
        </section>
      </div>
    </div>
  );
}
