import { Link } from 'react-router-dom';
import './Cookies.css';

export default function Cookies() {
  return (
    <div className="info-page">
      <header className="info-hero">
        <span className="info-kicker">FITKART / COOKIE POLICY</span>
        <h1>Cookie Policy</h1>
        <p className="info-lead">How website cookies may be used. This page explains common cookie purposes. Update it to match the actual analytics, advertising and session technologies installed on FitKart.</p>
        <div className="info-actions">
          <Link to="/shop">Explore the shop</Link>
          <Link className="secondary" to="/contact">Contact support</Link>
        </div>
      </header>
      <section className="info-panel">
        <h2>Cookie categories</h2>
        <p>A live website may use essential cookies for core functionality and optional cookies for analytics or personalization.</p>
      </section>
      <section className="info-panel">
        <h2>Your choices</h2>
        <ul><li>Essential cookies may be required for cart and account functions</li><li>Optional analytics or marketing cookies should be controlled through a consent mechanism where required</li><li>You can manage cookies through your browser settings</li></ul>
      </section>
      <p className="info-note">FitKart demo content — review and configure operational details before launching a live store.</p>
    </div>
  );
}
