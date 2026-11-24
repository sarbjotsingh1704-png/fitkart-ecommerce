import { inr } from '../components/PriceDisplay';
import './Account.css';
const orders = [['FK204118', '12 Aug 2026', 'Delivered', 3499], ['FK203876', '29 Jul 2026', 'Delivered', 1598], ['FK203112', '3 Jul 2026', 'Returned', 2199]];
export default function Account() {
  return (
    <div className="container page"><h1>My account</h1><p className="demo-note">Demo data only. Sign-in will be added with Clerk.</p>
      <div className="acct">
        <section className="panel"><h2>Profile</h2><p><b>Aarav Sharma</b><br />aarav@example.com<br />+91 98765 43210</p></section>
        <section className="panel"><h2>Size preferences</h2><p>Tops: M · Bottoms: 32 · Sneakers: UK 9<br />Preferred fit: Regular</p></section>
        <section className="panel"><h2>Saved addresses</h2><p>Home — 12 Model Town, Ludhiana 141002<br />Work — 4 Sector 17, Chandigarh 160017</p></section>
        <section className="panel wide"><h2>Order history</h2><div className="scroll"><table className="tbl"><thead><tr><th>Order</th><th>Date</th><th>Status</th><th>Total</th></tr></thead><tbody>{orders.map((o) => <tr key={o[0]}><td>{o[0]}</td><td>{o[1]}</td><td>{o[2]}</td><td>{inr(o[3])}</td></tr>)}</tbody></table></div></section>
      </div></div>
  );
}
