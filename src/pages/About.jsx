import { Link } from 'react-router-dom';
import './About.css';

export default function About() {
  return (
    <div className="info-page">
      <header className="info-hero">
        <span className="info-kicker">FITKART / ABOUT FITKART</span>
        <h1>About FitKart</h1>
        <p className="info-lead">Style that fits real life. FitKart makes everyday style easier to discover, choose and wear. We bring clothing, sneakers and accessories together with practical tools that help shoppers make confident decisions.</p>
        <div className="info-actions">
          <Link to="/shop">Explore the shop</Link>
          <Link className="secondary" to="/contact">Contact support</Link>
        </div>
      </header>
      <section className="info-panel">
        <h2>Our approach</h2>
        <p>We focus on useful product information, straightforward shopping and a more confident fit. FitMatch is designed to help customers explore outfit ideas and size guidance before they buy.</p>
      </section>
      <section className="info-panel">
        <h2>What matters to us</h2>
        <ul><li>Clear product information</li><li>A simple, dependable shopping experience</li><li>Thoughtful style for different needs and budgets</li></ul>
      </section>
      <p className="info-note">FitKart demo content — review and configure operational details before launching a live store.</p>
    </div>
  );
}
