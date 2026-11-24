import { Link } from 'react-router-dom';
import './Careers.css';

export default function Careers() {
  return (
    <div className="info-page">
      <header className="info-hero">
        <span className="info-kicker">FITKART / CAREERS AT FITKART</span>
        <h1>Careers at FitKart</h1>
        <p className="info-lead">Help us make shopping fit better. We’re building a customer-first shopping experience. This demo page does not currently list open vacancies.</p>
        <div className="info-actions">
          <Link to="/shop">Explore the shop</Link>
          <Link className="secondary" to="/contact">Contact support</Link>
        </div>
      </header>
      <section className="info-panel">
        <h2>Interested in working with us?</h2>
        <p>For future opportunities, send a short introduction and your portfolio or resume to careers@fitkart.demo. This is a placeholder contact address and must be configured before launch.</p>
      </section>
      <section className="info-panel">
        <h2>Teams we may grow</h2>
        <ul><li>Product and engineering</li><li>Design and content</li><li>Customer experience</li><li>Operations and logistics</li></ul>
      </section>
      <p className="info-note">FitKart demo content — review and configure operational details before launching a live store.</p>
    </div>
  );
}
