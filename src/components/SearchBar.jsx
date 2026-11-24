import { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export default function SearchBar() {
  const [q, setQ] = useState('');
  const nav = useNavigate();
  return (
    <form className="search" role="search" onSubmit={(e) => { e.preventDefault(); nav(`/shop?q=${encodeURIComponent(q.trim())}`); }}>
      <Search size={18} aria-hidden />
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" aria-label="Search products" />
    </form>
  );
}
