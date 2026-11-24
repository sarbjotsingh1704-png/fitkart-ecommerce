import { Link } from 'react-router-dom';
import './Shipping.css';

export default function Shipping() {
  return (
    <div className="info-page">
      <header className="info-hero">
        <span className="info-kicker">FITKART / SHIPPING POLICY</span>
        <h1>Shipping Policy</h1>
        <p className="info-lead">Delivery information, without the guesswork. Shipping timelines and charges should be confirmed at checkout before an order is placed.</p>
        <div className="info-actions">
          <Link to="/shop">Explore the shop</Link>
          <Link className="secondary" to="/contact">Contact support</Link>
        </div>
      </header>
      <section className="info-panel">
        <h2>Processing and delivery</h2>
        <p>Orders require processing before dispatch. Delivery estimates depend on the delivery address, courier service and product availability.</p>
      </section>
      <section className="info-panel">
        <h2>Shipping notes</h2>
        <ul><li>Available shipping options and charges should appear at checkout</li><li>Courier delays, weather and service disruptions can affect estimates</li><li>A tracking link should be shared after dispatch</li></ul>
      </section>
      <p className="info-note">FitKart demo content — review and configure operational details before launching a live store.</p>
    </div>
  );
}
