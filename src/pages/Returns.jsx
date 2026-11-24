import { Link } from 'react-router-dom';
import './Returns.css';

export default function Returns() {
  return (
    <div className="info-page">
      <header className="info-hero">
        <span className="info-kicker">FITKART / RETURNS & REFUNDS</span>
        <h1>Returns & Refunds</h1>
        <p className="info-lead">A clear and simple returns process. This page describes the intended FitKart demo return process. Confirm the final policy before accepting real customer orders.</p>
        <div className="info-actions">
          <Link to="/shop">Explore the shop</Link>
          <Link className="secondary" to="/contact">Contact support</Link>
        </div>
      </header>
      <section className="info-panel">
        <h2>Return eligibility</h2>
        <p>Items should be unused, unwashed and returned with original tags and packaging within the return window shown on the product or order confirmation.</p>
      </section>
      <section className="info-panel">
        <h2>How to request a return</h2>
        <ul><li>Open Track Order or contact support with your order number</li><li>Tell us which item you want to return and why</li><li>Wait for return instructions before shipping the item</li><li>Refunds are processed only after the returned item is inspected</li></ul>
      </section>
      <p className="info-note">FitKart demo content — review and configure operational details before launching a live store.</p>
    </div>
  );
}
