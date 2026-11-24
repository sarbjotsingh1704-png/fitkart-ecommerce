import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Plus, ArrowLeft } from 'lucide-react';
import { products as seed, CATEGORIES } from '../data/products';
import Modal from '../components/Modal';
import { inr } from '../components/PriceDisplay';
import { useStore } from '../context/StoreContext';
import './Admin.css';
const orders = [['FK204301', 'Meera K.', 'Processing', 4298], ['FK204299', 'Rohan P.', 'Shipped', 3499], ['FK204287', 'Isha T.', 'Delivered', 999], ['FK204250', 'Karan M.', 'Delivered', 2799]];
const status = (n) => (n === 0 ? 'Out of stock' : n < 10 ? 'Low stock' : 'In stock');
export default function Admin() {
  const { notify } = useStore();
  const [items, setItems] = useState(seed);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [edit, setEdit] = useState(null);
  const shown = items.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) && (!cat || p.category === cat));
  const save = (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    const rec = { ...edit, name: d.name.trim(), category: d.category, price: +d.price, stock: +d.stock };
    if (!rec.name || rec.price <= 0 || rec.stock < 0) return notify('Enter a name, a positive price and a valid stock');
    setItems((l) => (l.find((x) => x.id === rec.id) ? l.map((x) => (x.id === rec.id ? rec : x)) : [rec, ...l]));
    setEdit(null); notify('Product saved (demo, not persisted)');
  };
  return (
    <div className="admin">
      <aside className="side"><div className="logo light">Fit<span>Kart</span></div><nav><a href="#products"><Package size={18} /> Products</a><a href="#orders"><ShoppingCart size={18} /> Orders</a><a href="#products"><LayoutDashboard size={18} /> Inventory</a><Link to="/"><ArrowLeft size={18} /> Back to store</Link></nav></aside>
      <div className="admin-main"><p className="demo-note">Mock data only. No admin security or backend exists in this demo.</p>
        <section id="products"><div className="sec-head"><h1>Products</h1><button className="btn primary" onClick={() => setEdit({ id: Date.now(), name: '', category: 'men', price: 999, mrp: 1299, stock: 20, images: [seed[0].images[0]], sizes: ['M'], colors: [], rating: 0 })}><Plus size={16} /> Add product</button></div>
          <div className="row"><input className="inp" placeholder="Search products" aria-label="Search products" value={q} onChange={(e) => setQ(e.target.value)} />
            <select className="inp" aria-label="Category" value={cat} onChange={(e) => setCat(e.target.value)}><option value="">All categories</option>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select></div>
          <div className="scroll"><table className="tbl"><thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th /></tr></thead>
            <tbody>{shown.map((p) => <tr key={p.id}><td>{p.name}</td><td>{p.category}</td><td>{inr(p.price)}</td><td>{p.stock}</td><td><span className={`pill ${status(p.stock) === 'In stock' ? 'ok' : 'warn'}`}>{status(p.stock)}</span></td><td><button className="btn ghost sm" onClick={() => setEdit(p)}>Edit</button></td></tr>)}
              {!shown.length && <tr><td colSpan="6">No products match your search.</td></tr>}</tbody></table></div></section>
        <section id="orders"><h2>Recent orders</h2><div className="scroll"><table className="tbl"><thead><tr><th>Order</th><th>Customer</th><th>Status</th><th>Total</th></tr></thead><tbody>{orders.map((o) => <tr key={o[0]}><td>{o[0]}</td><td>{o[1]}</td><td>{o[2]}</td><td>{inr(o[3])}</td></tr>)}</tbody></table></div></section></div>
      {edit && <Modal title={items.find((x) => x.id === edit.id) ? 'Edit product' : 'Add product'} onClose={() => setEdit(null)}>
        <form onSubmit={save}><label className="field">Name<input name="name" defaultValue={edit.name} /></label>
          <label className="field">Category<select name="category" defaultValue={edit.category}>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select></label>
          <label className="field">Price (₹)<input name="price" type="number" defaultValue={edit.price} /></label>
          <label className="field">Stock<input name="stock" type="number" defaultValue={edit.stock} /></label>
          <button className="btn primary block">Save product</button></form></Modal>}
    </div>
  );
}
