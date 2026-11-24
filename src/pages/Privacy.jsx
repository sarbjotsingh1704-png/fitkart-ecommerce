import { Link } from 'react-router-dom';
import './Privacy.css';

export default function Privacy() {
  return (
    <div className="info-page">
      <header className="info-hero">
        <span className="info-kicker">FITKART / PRIVACY POLICY</span>
        <h1>Privacy Policy</h1>
        <p className="info-lead">Your information should be handled responsibly. This is a starter privacy notice for the FitKart demo. It is not a substitute for a legally reviewed policy tailored to your actual data practices.</p>
        <div className="info-actions">
          <Link to="/shop">Explore the shop</Link>
          <Link className="secondary" to="/contact">Contact support</Link>
        </div>
      </header>
      <section className="info-panel">
        <h2>Information you may provide</h2>
        <p>A functioning store may collect contact details, delivery addresses, order information and account credentials when customers use its services.</p>
      </section>
      <section className="info-panel">
        <h2>How information should be used</h2>
        <ul><li>To process orders, payments and delivery</li><li>To provide customer support and account features</li><li>To send marketing messages only where permitted and with appropriate consent</li><li>To protect the store and prevent misuse</li></ul>
      </section>
      <p className="info-note">FitKart demo content — review and configure operational details before launching a live store.</p>
    </div>
  );
}
