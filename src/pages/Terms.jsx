import { Link } from 'react-router-dom';
import './Terms.css';

export default function Terms() {
  return (
    <div className="info-page">
      <header className="info-hero">
        <span className="info-kicker">FITKART / TERMS & CONDITIONS</span>
        <h1>Terms & Conditions</h1>
        <p className="info-lead">The terms for using FitKart. These draft terms are a starting point for a demo storefront. Have them reviewed and adapted before operating a real commerce business.</p>
        <div className="info-actions">
          <Link to="/shop">Explore the shop</Link>
          <Link className="secondary" to="/contact">Contact support</Link>
        </div>
      </header>
      <section className="info-panel">
        <h2>Using the website</h2>
        <p>By using the website, visitors agree to use it lawfully and not interfere with its operation or other customers’ use.</p>
      </section>
      <section className="info-panel">
        <h2>Orders and product information</h2>
        <ul><li>Product images and descriptions are illustrative; verify details before purchase</li><li>Prices, availability and delivery estimates may change before order confirmation</li><li>An order is not confirmed until the store issues an order confirmation</li><li>Any cancellation, return or refund rights are subject to applicable law and the final published policy</li></ul>
      </section>
      <p className="info-note">FitKart demo content — review and configure operational details before launching a live store.</p>
    </div>
  );
}
