import { X } from 'lucide-react';
import { CATEGORIES } from '../data/products';
const SIZES = ['S', 'M', 'L', 'XL', 'XXL', '6', '7', '8', '9', '10', '11'];
const COLORS = ['Black', 'White', 'Navy', 'Grey', 'Olive', 'Sand', 'Red', 'Blue', 'Rose', 'Tan'];
const toggle = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
export default function FilterSidebar({ f, setF, open, onClose, reset }) {
  return (
    <aside className={`filters ${open ? 'open' : ''}`} aria-label="Filters">
      <div className="filters-head"><h2>Filters</h2><button className="icon-btn close-f" onClick={onClose} aria-label="Close filters"><X /></button></div>
      <fieldset><legend>Category</legend>
        <label><input type="radio" name="cat" checked={!f.cat} onChange={() => setF({ ...f, cat: '' })} /> All</label>
        {CATEGORIES.map((c) => <label key={c.id}><input type="radio" name="cat" checked={f.cat === c.id} onChange={() => setF({ ...f, cat: c.id })} /> {c.label}</label>)}
      </fieldset>
      <fieldset><legend>Size</legend><div className="chips">{SIZES.map((s) => <button type="button" key={s} className={`chip ${f.sizes.includes(s) ? 'on' : ''}`} onClick={() => setF({ ...f, sizes: toggle(f.sizes, s) })}>{s}</button>)}</div></fieldset>
      <fieldset><legend>Color</legend><div className="chips">{COLORS.map((c) => <button type="button" key={c} className={`chip ${f.colors.includes(c) ? 'on' : ''}`} onClick={() => setF({ ...f, colors: toggle(f.colors, c) })}>{c}</button>)}</div></fieldset>
      <fieldset><legend>Max price: ₹{f.maxPrice.toLocaleString('en-IN')}</legend><input type="range" min="500" max="5000" step="100" value={f.maxPrice} onChange={(e) => setF({ ...f, maxPrice: +e.target.value })} aria-label="Maximum price" /></fieldset>
      <fieldset><legend>Rating</legend>{[0, 4, 4.5].map((r) => <label key={r}><input type="radio" name="rate" checked={f.rating === r} onChange={() => setF({ ...f, rating: r })} /> {r ? `${r}★ & up` : 'Any'}</label>)}</fieldset>
      <fieldset><label><input type="checkbox" checked={f.sale} onChange={(e) => setF({ ...f, sale: e.target.checked })} /> On sale only</label></fieldset>
      <button className="btn ghost" onClick={reset}>Clear filters</button>
      <button className="btn primary apply-f" onClick={onClose}>Show results</button>
    </aside>
  );
}
