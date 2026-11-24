import { Link } from 'react-router-dom';
import './Sustainability.css';

export default function Sustainability() {
  return (
    <div className="info-page">
      <header className="info-hero">
        <span className="info-kicker">FITKART / OUR SUSTAINABILITY APPROACH</span>
        <h1>Our Sustainability Approach</h1>
        <p className="info-lead">Make more considered choices. We want to make it easier to find products you’ll use and value. Do not treat the statements on this demo page as verified environmental claims.</p>
        <div className="info-actions">
          <Link to="/shop">Explore the shop</Link>
          <Link className="secondary" to="/contact">Contact support</Link>
        </div>
      </header>
      <section className="info-panel">
        <h2>A practical starting point</h2>
        <p>Responsible retail requires measurable action, transparent sourcing and honest communication. We aim to prioritize product durability and reduce avoidable waste as the business develops.</p>
      </section>
      <section className="info-panel">
        <h2>Areas of focus</h2>
        <ul><li>Provide useful product and material information</li><li>Reduce unnecessary packaging where feasible</li><li>Improve order and returns processes to avoid preventable waste</li><li>Publish measurable progress rather than unsupported claims</li></ul>
      </section>
      <p className="info-note">FitKart demo content — review and configure operational details before launching a live store.</p>
    </div>
  );
}
