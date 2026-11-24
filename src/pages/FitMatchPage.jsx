import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, Heart, ShoppingBag, MapPin, Truck, Shirt, Package, ArrowRight, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Loader2, Ruler, Check } from 'lucide-react';
import FitMatchModal from '../components/FitMatchModal';
import SafeImage from '../components/SafeImage';
import { products } from '../data/products';
import { useStore } from '../context/StoreContext';
import useLocalStorage from '../hooks/useLocalStorage';
import './FitMatchPage.css';

const inr = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const OCCASIONS = ['Casual', 'College', 'Office', 'Date night', 'Weekend'];
const STYLES = ['Minimal', 'Streetwear', 'Smart casual', 'Sporty'];
const SWATCHES = [['Black', '#111827'], ['White', '#F3F4F6'], ['Sand', '#D6C6A8'], ['Navy', '#1A365D'], ['Olive', '#6B705C'], ['Grey', '#9CA3AF'], ['Red', '#C0392B']];
const BMIN = 1000, BMAX = 5000;
const SHOE_SIZES = ['6', '7', '8', '9', '10', '11'];

// Which real catalogue products can fill each slot, and which occasion/style tags they suit.
const SLOTS = [
  { key: 'layer', label: 'Overshirt / layer', ids: [4, 2], size: 'M' },
  { key: 'tee', label: 'T-shirt', ids: [1], size: 'M' },
  { key: 'bottom', label: 'Trousers', ids: [3], size: 'M' },
  { key: 'shoes', label: 'Shoes', ids: [9, 11, 10, 12], size: '8' },
  { key: 'watch', label: 'Watch', ids: [13], size: 'One Size', optional: true },
];
const TAGS = {
  4: ['Casual', 'Office', 'Date night', 'Minimal', 'Smart casual'],
  2: ['Casual', 'College', 'Weekend', 'Streetwear', 'Sporty'],
  1: ['Casual', 'College', 'Weekend', 'Office', 'Minimal', 'Streetwear', 'Sporty', 'Smart casual', 'Date night'],
  3: ['Casual', 'Office', 'Date night', 'Weekend', 'Minimal', 'Smart casual', 'College'],
  9: ['Casual', 'Office', 'Date night', 'Minimal', 'Smart casual'],
  11: ['Casual', 'Weekend', 'Smart casual', 'Minimal'],
  10: ['College', 'Weekend', 'Sporty', 'Streetwear'],
  12: ['Weekend', 'Streetwear', 'Sporty', 'College'],
  13: ['Office', 'Date night', 'Minimal', 'Smart casual'],
};
const byId = (id) => products.find((p) => p.id === id);

function rank(slot, prefs) {
  return slot.ids.map(byId).filter(Boolean).map((p) => {
    const tags = TAGS[p.id] || [];
    let s = (tags.includes(prefs.occasion) ? 2 : 0) + (tags.includes(prefs.style) ? 2 : 0);
    if (prefs.color && p.colors.some((c) => c.name === prefs.color)) s += 3;
    return { p, s };
  }).sort((a, b) => b.s - a.s || a.p.price - b.p.price).map((x) => x.p);
}

function buildLook(prefs, variant) {
  const picks = {};
  SLOTS.forEach((sl) => {
    const r = rank(sl, prefs);
    if (r.length) picks[sl.key] = r[variant % r.length];
  });
  // Keep within budget by swapping the priciest swappable item for a cheaper alternative.
  const total = () => Object.entries(picks).filter(([k]) => k !== 'watch').reduce((s, [, p]) => s + p.price, 0);
  let guard = 12;
  while (total() > prefs.max && guard--) {
    let best = null;
    SLOTS.filter((s) => s.key !== 'watch').forEach((sl) => {
      const cheaper = rank(sl, prefs).filter((p) => p.price < picks[sl.key].price).sort((a, b) => b.price - a.price)[0];
      if (cheaper && (!best || picks[sl.key].price - cheaper.price > best.save)) best = { k: sl.key, p: cheaper, save: picks[sl.key].price - cheaper.price };
    });
    if (!best) break;
    picks[best.k] = best.p;
  }
  return picks;
}

// Frontend-only estimate. No courier/serviceability API exists in this project yet.
const METRO = ['110', '400', '560', '600', '700', '500', '411', '380'];
function estimateDelivery(pin, orderValue) {
  const metro = METRO.some((m) => pin.startsWith(m));
  const zone = pin[0];
  const days = metro ? [2, 3] : ['1', '2', '3', '4'].includes(zone) ? [3, 5] : [4, 6];
  const add = (n) => { const d = new Date(); let left = n; while (left > 0) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) left--; } return d; };
  const fmt = (d) => d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  return { range: `${fmt(add(days[0]))} – ${fmt(add(days[1]))}`, shipping: orderValue >= 1999 ? 0 : 99, metro };
}

export default function FitMatchPage() {
  const { addToCart, wish, toggleWish, setCode, setDrawerOpen, notify } = useStore();
  const [savedLooks, setSavedLooks] = useLocalStorage('fitkart_looks', []);
  const [prefs, setPrefs] = useState({ occasion: 'Casual', style: 'Minimal', min: BMIN, max: BMAX, color: 'Sand' });
  const [variant, setVariant] = useState(0);
  const [removed, setRemoved] = useState(['watch']);
  const [qty, setQty] = useState({});
  const [sz, setSz] = useState(Object.fromEntries(SLOTS.map((s) => [s.key, s.size])));
  const [rec, setRec] = useState(null);
  const [finder, setFinder] = useState(null);
  const [step, setStep] = useState(1);
  const [pin, setPin] = useState('');
  const [dv, setDv] = useState({ state: 'idle' });

  const look = useMemo(() => buildLook(prefs, variant), [prefs, variant]);
  const items = SLOTS.filter((s) => look[s.key] && !removed.includes(s.key)).map((s) => ({ slot: s, p: look[s.key], qty: qty[s.key] || 1, size: sz[s.key] }));
  const subtotal = items.reduce((t, i) => t + i.p.price * i.qty, 0);
  const saving = items.length >= 3 ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - saving;
  const coreTotal = items.filter((i) => i.slot.key !== 'watch').reduce((t, i) => t + i.p.price * i.qty, 0);
  const overBudget = coreTotal > prefs.max;
  const underBudget = items.length > 0 && coreTotal < prefs.min;
  const pref = (k, v) => { setPrefs((p) => ({ ...p, [k]: v })); setRemoved((r) => r.filter((x) => x === 'watch')); setStep(1); };
  const touch = () => setStep((s) => Math.max(s, 2));
  const colorFor = (p) => (p.colors.find((c) => c.name === prefs.color) || p.colors[0]).name;
  const looksSaved = items.length > 0 && items.every((i) => wish.includes(i.p.id));

  const addAll = () => {
    if (!items.length) return notify('Your outfit is empty');
    items.forEach((i) => addToCart(i.p, { size: i.size, color: colorFor(i.p), qty: i.qty }));
    if (saving) setCode('FIT10');
    setDrawerOpen(true);
  };
  const saveLook = () => {
    if (!items.length) return notify('Nothing to save yet');
    setSavedLooks([{ at: Date.now(), prefs, items: items.map((i) => ({ id: i.p.id, size: i.size, qty: i.qty })) }, ...savedLooks].slice(0, 20));
    items.forEach((i) => { if (!wish.includes(i.p.id)) toggleWish(i.p.id); });
    notify('Look saved to your wishlist');
  };
  const checkPin = (e) => {
    e.preventDefault(); setStep(3);
    if (!/^[1-9]\d{5}$/.test(pin)) return setDv({ state: 'error', msg: 'Enter a valid 6-digit Indian PIN code.' });
    setDv({ state: 'loading' });
    setTimeout(() => setDv({ state: 'ok', ...estimateDelivery(pin, total) }), 700);
  };
  const applyFinder = (size) => {
    if (finder === 'footwear') { setSz((s) => ({ ...s, shoes: size })); setRec((r) => ({ ...r, shoes: size })); }
    else { setSz((s) => ({ ...s, layer: size, tee: size, bottom: size })); setRec((r) => ({ ...r, top: size, bottom: size })); }
    setFinder(null); setStep(3); notify(`Size ${size} applied`);
  };
  const fitState = (key, val) => (!rec || !rec[key] ? ['', 'Default size'] : rec[key] === val ? ['ok', 'Good fit'] : ['warn', 'Differs from FitMatch']);
  const topSize = sz.layer === sz.tee ? sz.layer : sz.layer;
  const setTop = (v) => setSz((s) => ({ ...s, layer: v, tee: v }));

  const slotImg = (k) => (look[k] && !removed.includes(k) ? look[k].images[0] : null);
  const steps = ['Choose your style', 'Build your outfit', 'Check your fit & delivery'];

  return (
    <div className="fx">
      <section className="fx-hero">
        <div className="fx-wrap fx-hero-in">
          <div>
            <span className="fx-pill">FitMatch Style Studio</span>
            <h1><span className="n">Build your look.</span> <span className="o">Find your fit.</span></h1>
            <p>Create outfits, get size guidance, and see your delivery estimate — all in one place.</p>
          </div>
          <div className="fx-model" aria-hidden="true">
            <SafeImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=75" alt="FitKart model" />
            <span className="fx-script">Style<br />Match<br />Your Vibe</span>
          </div>
        </div>
      </section>

      <div className="fx-wrap">
        <ol className="fx-steps" aria-label="Progress">
          {steps.map((t, i) => (
            <li key={t} className={step === i + 1 ? 'on' : step > i + 1 ? 'done' : ''} aria-current={step === i + 1 ? 'step' : undefined}><b>{step > i + 1 ? <Check size={16} /> : i + 1}</b><span>{t}</span></li>
          ))}
        </ol>

        <div className="fx-grid">
          {/* LEFT */}
          <aside className="fx-card fx-style">
            <h2>Your style</h2>
            <p className="sub">Tell us your preferences and we'll help you build the perfect outfit.</p>
            <h3>Occasion</h3>
            <div className="fx-chips">{OCCASIONS.map((o) => <button key={o} type="button" aria-pressed={prefs.occasion === o} className={prefs.occasion === o ? 'on' : ''} onClick={() => pref('occasion', o)}>{o}</button>)}</div>
            <h3>Style</h3>
            <div className="fx-chips">{STYLES.map((o) => <button key={o} type="button" aria-pressed={prefs.style === o} className={prefs.style === o ? 'on' : ''} onClick={() => pref('style', o)}>{o}</button>)}</div>
            <h3>Budget range</h3>
            <div className="fx-bval">{inr(prefs.min)} — {inr(prefs.max)}</div>
            <div className="fx-range">
              <div className="track"><i style={{ left: `${((prefs.min - BMIN) / (BMAX - BMIN)) * 100}%`, right: `${100 - ((prefs.max - BMIN) / (BMAX - BMIN)) * 100}%` }} /></div>
              <input type="range" min={BMIN} max={BMAX} step={100} value={prefs.min} aria-label="Minimum budget" onChange={(e) => pref('min', Math.min(+e.target.value, prefs.max - 500))} />
              <input type="range" min={BMIN} max={BMAX} step={100} value={prefs.max} aria-label="Maximum budget" onChange={(e) => pref('max', Math.max(+e.target.value, prefs.min + 500))} />
            </div>
            <div className="fx-rl"><span>{inr(BMIN)}</span><span>{inr(BMAX)}</span></div>
            <h3>Preferred colors</h3>
            <div className="fx-sw" role="group" aria-label="Preferred colour">
              {SWATCHES.map(([n, hex]) => <button key={n} type="button" title={n} aria-label={n} aria-pressed={prefs.color === n} className={prefs.color === n ? 'on' : ''} style={{ background: hex }} onClick={() => pref('color', prefs.color === n ? '' : n)} />)}
            </div>
          </aside>

          {/* CENTER */}
          <section className="fx-card fx-build" onClick={touch}>
            <div className="fx-preview">
              <span className="fx-script s2">Complete<br />Your Look</span>
              {['layer', 'tee', 'bottom', 'shoes', 'watch'].map((k) => slotImg(k) && <figure key={k} className={`pc pc-${k}`}><SafeImage src={slotImg(k)} alt={look[k].name} /></figure>)}
              {!items.length && <p className="fx-emp">Your outfit is empty — change a preference to rebuild it.</p>}
              <span className="fx-cap">{items.length} Items · {prefs.style} Look</span>
              <div className="fx-nav">
                <button type="button" aria-label="Previous look" onClick={() => setVariant((v) => (v + 3) % 4)}><ChevronLeft size={18} /></button>
                <button type="button" aria-label="Next look" onClick={() => setVariant((v) => (v + 1) % 4)}><ChevronRight size={18} /></button>
              </div>
              <div className="fx-dots">{[0, 1, 2, 3].map((i) => <i key={i} className={i === variant ? 'on' : ''} />)}</div>
            </div>
            <div className="fx-items">
              {items.map(({ slot, p, qty: q, size }) => (
                <article key={slot.key} className="fx-item">
                  <Link to={`/product/${p.id}`} className="im"><SafeImage src={p.images[0]} alt={p.name} /></Link>
                  <div className="info">
                    <h4>{p.name}</h4>
                    <small>{slot.label} · {p.material.split(',')[0]}</small>
                    <strong>{inr(p.price)}</strong>
                    <div className="ctl">
                      {p.sizes.length > 1 ? (
                        <select aria-label={`Size for ${p.name}`} value={size} onChange={(e) => setSz((s) => ({ ...s, [slot.key]: e.target.value }))}>
                          {p.sizes.map((s) => <option key={s} value={s}>{slot.key === 'shoes' ? `UK ${s}` : s}</option>)}
                        </select>
                      ) : <span className="one">One size</span>}
                      <div className="qty">
                        <button type="button" aria-label="Decrease quantity" disabled={q <= 1} onClick={() => setQty((x) => ({ ...x, [slot.key]: q - 1 }))}><Minus size={14} /></button>
                        <span>{q}</span>
                        <button type="button" aria-label="Increase quantity" disabled={q >= 10} onClick={() => setQty((x) => ({ ...x, [slot.key]: q + 1 }))}><Plus size={14} /></button>
                      </div>
                    </div>
                  </div>
                  <button type="button" className="rm" aria-label={`Remove ${p.name}`} onClick={() => setRemoved((r) => [...r, slot.key])}><Trash2 size={16} /></button>
                </article>
              ))}
              {removed.length > 0 && (
                <div className="fx-readd">{removed.filter((k) => look[k]).map((k) => <button key={k} type="button" onClick={() => setRemoved((r) => r.filter((x) => x !== k))}><Plus size={14} /> Add {SLOTS.find((s) => s.key === k).label.toLowerCase()}</button>)}</div>
              )}
              {overBudget && <p className="fx-warn"><AlertCircle size={15} /> This look is above your {inr(prefs.max)} budget — raise it to see the full outfit.</p>}
              {underBudget && <p className="fx-note">This look is below your {inr(prefs.min)} minimum.</p>}
            </div>
          </section>

          {/* RIGHT */}
          <div className="fx-right">
            <section className="fx-card fx-total">
              <h2>Your complete look</h2>
              <p className="sub">{items.length} item{items.length === 1 ? '' : 's'} selected</p>
              <dl>
                <dt>Subtotal</dt><dd>{inr(subtotal)}</dd>
                <dt className="g">Bundle saving{saving ? ' (FIT10)' : ''}</dt><dd className="g">{saving ? `− ${inr(saving)}` : '₹0'}</dd>
              </dl>
              {!saving && items.length > 0 && <p className="fx-note">Add 3 or more items to save 10%.</p>}
              <div className="tot"><span>Total</span><strong>{inr(total)}</strong></div>
              <button type="button" className="fx-cta" onClick={addAll} disabled={!items.length}><ShoppingBag size={18} /> Add entire outfit to bag</button>
              <button type="button" className="fx-ghost" onClick={saveLook} disabled={!items.length}><Heart size={18} fill={looksSaved ? 'currentColor' : 'none'} /> {looksSaved ? 'Look saved' : 'Save this look'}</button>
            </section>

            <section className="fx-card fx-mini">
              <header><span className="ic"><Ruler size={22} /></span><div><h3>Smart fit</h3><small>{rec ? 'Based on your FitMatch measurements' : 'Default sizes — find yours for a real recommendation'}</small></div>
                <button type="button" className="lnk" onClick={() => setFinder('clothing')}>Size guide</button></header>
              {[['Top (Overshirt / T-shirt)', 'top', topSize, setTop, products[0].sizes], ['Trousers', 'bottom', sz.bottom, (v) => setSz((s) => ({ ...s, bottom: v })), products[0].sizes], ['Shoes', 'shoes', sz.shoes, (v) => setSz((s) => ({ ...s, shoes: v })), SHOE_SIZES]].map(([l, k, v, set, opts]) => {
                const [cls, txt] = fitState(k, v);
                return (
                  <div className="row" key={k}>
                    <label htmlFor={`sf-${k}`}>{l}</label>
                    <select id={`sf-${k}`} value={v} onChange={(e) => { set(e.target.value); setStep(3); }}>{opts.map((s) => <option key={s} value={s}>{k === 'shoes' ? `UK ${s}` : s}</option>)}</select>
                    <span className={`st ${cls}`}>{cls === 'ok' ? <CheckCircle2 size={16} /> : cls === 'warn' ? <AlertCircle size={16} /> : null}{txt}</span>
                  </div>
                );
              })}
              <div className="fx-two"><button type="button" onClick={() => setFinder('clothing')}>Find clothing size</button><button type="button" onClick={() => setFinder('footwear')}>Find shoe size</button></div>
            </section>

            <section className="fx-card fx-mini">
              <header><span className="ic"><Truck size={22} /></span><div><h3>Delivery estimate</h3><small>Enter your PIN code to check estimated delivery date.</small></div></header>
              <form className="fx-pin" onSubmit={checkPin} noValidate>
                <label className="in"><MapPin size={17} /><input inputMode="numeric" maxLength={6} placeholder="Enter PIN code" aria-label="PIN code" aria-invalid={dv.state === 'error'} value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, '')); if (dv.state !== 'idle') setDv({ state: 'idle' }); }} /></label>
                <button type="submit" disabled={dv.state === 'loading'}>{dv.state === 'loading' ? <Loader2 size={16} className="spin" /> : null} Check delivery date</button>
              </form>
              <div aria-live="polite">
                {dv.state === 'loading' && <p className="fx-note">Checking delivery for {pin}…</p>}
                {dv.state === 'error' && <p className="fx-err"><AlertCircle size={15} /> {dv.msg}</p>}
                {dv.state === 'ok' && <p className="fx-ok"><CheckCircle2 size={15} /> Estimated delivery <b>{dv.range}</b> · {dv.shipping ? `${inr(dv.shipping)} shipping` : 'Free shipping'}<small>Estimate based on PIN region{dv.metro ? ' (metro)' : ''}; final date is confirmed at checkout.</small></p>}
              </div>
            </section>
          </div>
        </div>

        <div className="fx-feats">
          {[[Shirt, 'Smart size guidance', 'Find your best fit with personalised recommendations.', () => setFinder('clothing'), 'b'], [Package, 'Outfit bundling', 'See your total and bundle savings.', () => document.querySelector('.fx-total')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 'o'], [Truck, 'Transparent delivery', 'Know your estimated arrival before checkout.', () => document.getElementById('sf-top') && document.querySelector('.fx-pin input')?.focus(), 'b']].map(([I, t, d, fn, c]) => (
            <button type="button" key={t} className={`fx-feat ${c}`} onClick={fn}><span className="ic"><I size={26} /></span><span className="tx"><b>{t}</b><small>{d}</small></span><span className="go"><ArrowRight size={16} /></span></button>
          ))}
        </div>
      </div>
      {finder && <FitMatchModal product={{ kind: finder }} onClose={() => setFinder(null)} onApply={applyFinder} />}
    </div>
  );
}
