import { Link } from 'react-router-dom';
import './Blog.css';
const articles = [
  { category: 'STYLE GUIDE', title: 'Build a wardrobe that works harder', excerpt: 'Start with versatile essentials, choose pieces that work together and make every purchase count.', date: 'STYLE NOTES' },
  { category: 'FIT & SIZING', title: 'A practical guide to finding your fit', excerpt: 'Use garment measurements, compare them with a piece you already own and check each product’s size notes.', date: 'FITKART GUIDE' },
  { category: 'SNEAKER CARE', title: 'Simple habits to keep sneakers looking fresh', excerpt: 'Clean gently, let shoes dry naturally and store them away from direct heat and sunlight.', date: 'CARE TIPS' }
];
export default function Blog(){return <div className="blog-page"><header className="blog-hero"><span>THE FITKART JOURNAL</span><h1>Ideas for everyday style</h1><p>Practical guides on fit, wardrobe building and taking care of the things you wear.</p></header><div className="blog-grid">{articles.map((a,i)=><article className="blog-card" key={a.title}><div className={`blog-art blog-art-${i+1}`}><span>{a.category}</span></div><div className="blog-copy"><small>{a.date}</small><h2>{a.title}</h2><p>{a.excerpt}</p><Link to="/shop">Explore FitKart →</Link></div></article>)}</div><p className="blog-disclaimer">Editorial preview content for the FitKart demo. Replace with reviewed articles before launch.</p></div>}
