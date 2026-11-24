import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Phone, MapPin, Truck, RotateCcw, ShieldCheck, Headset, Instagram, Facebook, Youtube } from 'lucide-react';
import './Footer.css';

const shopLinks = [
  ['Men', '/shop?cat=men'], ['Women', '/shop?cat=women'], ['Shoes', '/shop?cat=shoes'],
  ['Accessories', '/shop?cat=accessories'], ['New Arrivals', '/shop?sort=new'], ['Sale', '/shop?sale=1'], ['FitMatch', '/fitmatch']
];
const helpLinks = [
  ['Track Order', '/track-order'], ['Returns & Refunds', '/returns'], ['Size Guide', '/fitmatch'],
  ['FAQ', '/help'], ['My Account', '/account'], ['Wishlist', '/wishlist'], ['Contact Us', '/contact']
];
const companyLinks = [
  ['About Us', '/about'], ['Careers', '/careers'], ['Blog', '/blog'],
  ['Terms & Conditions', '/terms'], ['Privacy Policy', '/privacy'], ['Cookie Policy', '/cookies'], ['Sustainability', '/sustainability']
];

function FooterLinks({ title, links }) {
  return <div className="fit-footer__column"><h3>{title}</h3>{links.map(([label, to]) => <Link key={label} to={to}>{label}</Link>)}</div>;
}

export default function Footer() {
  const submitNewsletter = (event) => {
    event.preventDefault();
    // Connect this form to your newsletter endpoint when the backend is ready.
  };

  return (
    <footer className="fit-footer">
      <div className="fit-footer__inner">
        <div className="fit-footer__main">
          <section className="fit-footer__brand">
            <Link to="/" className="fit-footer__logo" aria-label="FitKart home">Fit<span>Kart</span></Link>
            <p className="fit-footer__tagline">Clothing, sneakers and accessories with a size you can trust.</p>
            <div className="fit-footer__newsletter">
              <span className="fit-footer__eyebrow">STAY IN THE LOOP</span>
              <h2>Get 10% off your first order</h2>
              <p>Join the list for new drops and offers.</p>
              <form onSubmit={submitNewsletter} className="fit-footer__form">
                <label className="fit-footer__email"><Mail size={21} aria-hidden="true" /><input type="email" placeholder="you@example.com" aria-label="Email address" required /></label>
                <button type="submit">Subscribe <ArrowRight size={19} /></button>
              </form>
            </div>
          </section>

          <FooterLinks title="SHOP" links={shopLinks} />
          <FooterLinks title="HELP" links={helpLinks} />
          <FooterLinks title="COMPANY" links={companyLinks} />

          <section className="fit-footer__contact">
            <h3>GET IN TOUCH</h3>
            <a href="mailto:support@fitkart.demo"><Mail /><span>support@fitkart.demo</span></a>
            <a href="tel:+919876543210"><Phone /><span>+91 98765 43210</span></a>
            <div className="fit-footer__address"><MapPin /><span>Phagwara, Punjab, India</span></div>
          </section>
        </div>

        <div className="fit-footer__benefits">
          <div><Truck /><p><strong>Free Shipping</strong><span>On orders over ₹1,999</span></p></div>
          <div><RotateCcw /><p><strong>Easy Returns</strong><span>14-day return policy</span></p></div>
          <div><ShieldCheck /><p><strong>Secure Payment</strong><span>100% secure checkout</span></p></div>
          <div><Headset /><p><strong>24/7 Support</strong><span>We're here to help</span></p></div>
        </div>

        <div className="fit-footer__bottom">
          <p>© {new Date().getFullYear()} FitKart. All rights reserved.</p>
          <div className="fit-footer__payments" aria-label="Accepted payment methods">
            <span className="pay-visa">VISA</span><span className="pay-master"><i></i><i></i></span>
            <span className="pay-rupay">RuPay</span><span className="pay-upi">UPI</span><span className="pay-paytm">paytm</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
