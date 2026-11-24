import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Heart, ShoppingBag, User, Menu, X, Truck, Headset } from 'lucide-react';
import SearchBar from './SearchBar';
import { useStore } from '../context/StoreContext';
import './Navbar.css';
const links = [['/', 'Home'], ['/shop?cat=men', 'Men'], ['/shop?cat=women', 'Women'], ['/shop?cat=shoes', 'Shoes'], ['/shop?cat=accessories', 'Accessories'], ['/shop?sale=1', 'Sale']];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { count, wish, setDrawerOpen } = useStore();
  return (
    <>
      <div className="announce"><span><Truck size={16}/> Free Shipping on Orders Above ₹999 <i /> Easy Returns within 7 Days</span><span className="announce-help">Track Order <i /> <Headset size={16}/> Help &amp; Support</span></div>
      <header className="navbar">
        <div className="container nav-row">
          <button className="icon-btn menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>{open ? <X /> : <Menu />}</button>
          <Link to="/" className="logo">Fit<span>Kart</span></Link>
          <nav className={`links ${open ? 'open' : ''}`} aria-label="Main">
            {links.map(([to, l]) => <NavLink key={l} to={to} end={to === '/'} onClick={() => setOpen(false)}>{l}</NavLink>)}
            <NavLink to="/fitmatch" onClick={() => setOpen(false)} className="fm-link">FitMatch</NavLink>
          </nav>
          <SearchBar />
          <div className="nav-icons">
            <Link to="/sign-in" className="icon-btn" aria-label="Account"><User size={21} /></Link>
            <Link to="/wishlist" className="icon-btn badge-wrap" aria-label="Wishlist"><Heart size={21} />{wish.length > 0 && <b className="badge">{wish.length}</b>}</Link>
            <button className="icon-btn badge-wrap" onClick={() => setDrawerOpen(true)} aria-label="Open cart"><ShoppingBag size={21} />{count > 0 && <b className="badge">{count}</b>}</button>
          </div>
        </div>
      </header>
    </>
  );
}
