import { useState } from 'react';
import { Link } from 'react-router-dom';
import './FAQ.css';
const faqs = [
 ['How do I place an order?','Browse the shop, choose a product and its available options, add it to your cart and continue to checkout.'],
 ['How can I track my order?','Use the Track Order page with the order reference and email address associated with your order. Tracking is a demo interface until connected to an order backend.'],
 ['Can I return an item?','Check the Returns & Refunds page and the final return terms shown with your order. Contact support before sending an item back.'],
 ['How do I choose the right size?','Check the product size information and use FitMatch for additional style and size guidance.'],
 ['Which payment methods are accepted?','The payment options displayed at checkout are the available options. The current project still needs a live payment gateway integration.'],
 ['How do I contact support?','Use the Contact Us page or email support@fitkart.demo after configuring that address for your store.']
];
export default function FAQ(){const [open,setOpen]=useState(0);return <div className="faq-page"><header className="faq-hero"><span>FITKART / HELP CENTRE</span><h1>Frequently asked questions</h1><p>Quick answers about shopping, orders, sizing and returns.</p></header><div className="faq-list">{faqs.map(([q,a],i)=><section className="faq-item" key={q}><button aria-expanded={open===i} onClick={()=>setOpen(open===i?-1:i)}><strong>{q}</strong><span>{open===i?'−':'+'}</span></button>{open===i&&<p>{a}</p>}</section>)}</div><p className="faq-contact">Still need help? <Link to="/contact">Contact our support team</Link>.</p></div>}
