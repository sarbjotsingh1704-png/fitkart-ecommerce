import { useState } from "react";
import { Link } from "react-router-dom";
import {
  UserRound,
  MapPin,
  CreditCard,
  ShoppingBag,
  Tag,
  Trash2,
  Minus,
  Plus,
  LockKeyhole,
  ShieldCheck,
  Truck,
  RefreshCw,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

import { useStore } from "../context/StoreContext";
import { inr } from "../components/PriceDisplay";
import "./Checkout.css";

export default function Checkout() {
  const {
    lines,
    subtotal,
    discount,
    shipping,
    total,
    clearCart,
    setQty,
    removeItem,
    code,
    setCode,
  } = useStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Punjab",
    pin: "",
    billingSame: true,
  });

  const [errors, setErrors] = useState({});
  const [coupon, setCoupon] = useState(code || "");
  const [couponMessage, setCouponMessage] = useState("");
  const [payment, setPayment] = useState("upi");
  const [order, setOrder] = useState(null);

  const update = (e) => {
    const { name, value, checked, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Enter valid email";
    if (!/^[6-9]\d{9}$/.test(form.phone))
      newErrors.phone = "Enter valid mobile number";
    if (!form.address.trim()) newErrors.address = "Enter address";
    if (!form.city.trim()) newErrors.city = "Enter city";
    if (!/^\d{6}$/.test(form.pin))
      newErrors.pin = "Enter valid pincode";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "FIT10") {
      setCode("FIT10");
      setCouponMessage("10% discount applied!");
    } else {
      setCode("");
      setCouponMessage("Invalid coupon code");
    }
  };

  const placeOrder = (e) => {
    e.preventDefault();

    if (!validate()) return;

    setOrder({
      id: `FK${Date.now().toString().slice(-6)}`,
      amount: total,
    });

    clearCart();
  };

  if (order) {
    return (
      <div className="checkout-success">
        <CheckCircle2 size={55} />
        <h1>Order Placed Successfully!</h1>
        <p>Order ID: {order.id}</p>
        <h3>Total: {inr(order.amount)}</h3>
        <p>This is a demo order. No payment was collected.</p>
        <Link to="/shop">Continue Shopping</Link>
      </div>
    );
  }

  if (!lines.length) {
    return (
      <div className="checkout-empty">
        <ShoppingBag size={50} />
        <h1>Your cart is empty</h1>
        <Link to="/shop">Explore Products</Link>
      </div>
    );
  }

  return (
    <form className="checkout-page" onSubmit={placeOrder}>
      <div className="checkout-main">

        <div className="checkout-heading">
          <div>
            <h1>Checkout</h1>

            <nav className="checkout-breadcrumb">
              <Link to="/">Home</Link>
              <ChevronRight size={15} />
              <span>Cart</span>
              <ChevronRight size={15} />
              <span>Checkout</span>
            </nav>
          </div>

          <div className="checkout-steps">
            <div className="active">
              <span>1</span>
              Shipping
            </div>
            <div>
              <span>2</span>
              Payment
            </div>
            <div>
              <span>3</span>
              Review
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <section className="checkout-section">
          <h2>
            <UserRound /> Contact Information
          </h2>

          <div className="checkout-fields two-col">
            <label>
              Full Name *
              <input
                name="name"
                value={form.name}
                onChange={update}
                placeholder="Full name"
              />
              <small>{errors.name}</small>
            </label>

            <label>
              Email *
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={update}
                placeholder="Email address"
              />
              <small>{errors.email}</small>
            </label>

            <label className="full-width">
              Mobile Number *
              <input
                name="phone"
                value={form.phone}
                onChange={update}
                maxLength={10}
                placeholder="Mobile number"
              />
              <small>{errors.phone}</small>
            </label>
          </div>
        </section>

        {/* Shipping Address */}
        <section className="checkout-section">
          <h2>
            <MapPin /> Shipping Address
          </h2>

          <div className="checkout-fields">
            <label>
              Address *
              <input
                name="address"
                value={form.address}
                onChange={update}
                placeholder="House number, street, area"
              />
              <small>{errors.address}</small>
            </label>

            <div className="checkout-fields three-col">
              <label>
                City *
                <input
                  name="city"
                  value={form.city}
                  onChange={update}
                  placeholder="City"
                />
                <small>{errors.city}</small>
              </label>

              <label>
                State *
                <select
                  name="state"
                  value={form.state}
                  onChange={update}
                >
                  <option>Punjab</option>
                  <option>Haryana</option>
                  <option>Delhi</option>
                  <option>Chandigarh</option>
                  <option>Himachal Pradesh</option>
                  <option>Rajasthan</option>
                  <option>Other</option>
                </select>
              </label>

              <label>
                Pincode *
                <input
                  name="pin"
                  value={form.pin}
                  onChange={update}
                  maxLength={6}
                  placeholder="Pincode"
                />
                <small>{errors.pin}</small>
              </label>
            </div>

            <label className="checkout-checkbox">
              <input
                type="checkbox"
                name="billingSame"
                checked={form.billingSame}
                onChange={update}
              />
              Use this address for billing as well
            </label>
          </div>
        </section>

        {/* Payment Method */}
        <section className="checkout-section">
          <h2>
            <CreditCard /> Payment Method
          </h2>

          <div className="payment-options">
            {[
              ["upi", "UPI"],
              ["card", "Credit / Debit Card"],
              ["netbanking", "Net Banking"],
              ["cod", "Cash on Delivery (COD)"],
            ].map(([value, label]) => (
              <label
                key={value}
                className={payment === value ? "selected" : ""}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={payment === value}
                  onChange={() => setPayment(value)}
                />
                <span className="payment-radio"></span>
                <strong>{label}</strong>
              </label>
            ))}
          </div>

          <p className="payment-note">
            Payment gateway integration is required for real transactions.
          </p>
        </section>
      </div>

      {/* Order Summary */}
      <aside className="checkout-summary">
        <div className="checkout-summary-title">
          <h2>
            <ShoppingBag /> Order Summary
          </h2>
          <span>
            {lines.reduce((sum, item) => sum + item.qty, 0)} Items
          </span>
        </div>

        <div className="checkout-items">
          {lines.map((item) => (
            <div className="checkout-item" key={item.key}>
              <img
                src={item.product.images?.[0]}
                alt={item.product.name}
              />

              <div className="checkout-item-info">
                <strong>{item.product.name}</strong>

                <span>
                  Size: {item.size} | Color: {item.color}
                </span>

                <div className="checkout-qty">
                  <button
                    type="button"
                    onClick={() => setQty(item.key, item.qty - 1)}
                  >
                    <Minus size={14} />
                  </button>

                  {item.qty}

                  <button
                    type="button"
                    onClick={() => setQty(item.key, item.qty + 1)}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <strong>
                {inr(item.product.price * item.qty)}
              </strong>

              <button
                type="button"
                className="checkout-remove"
                onClick={() => removeItem(item.key)}
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>

        {/* Coupon */}
        <div className="checkout-coupon">
          <div>
            <Tag size={19} />
            <input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Enter coupon code"
            />
          </div>

          <button type="button" onClick={applyCoupon}>
            Apply
          </button>
        </div>

        {couponMessage && (
          <p className="coupon-message">{couponMessage}</p>
        )}

        {/* Price Details */}
        <div className="checkout-totals">
          <div>
            <span>Subtotal</span>
            <strong>{inr(subtotal)}</strong>
          </div>

          {discount > 0 && (
            <div>
              <span>Discount</span>
              <strong className="positive">
                - {inr(discount)}
              </strong>
            </div>
          )}

          <div>
            <span>Shipping</span>
            <strong className="positive">
              {shipping === 0 ? "Free" : inr(shipping)}
            </strong>
          </div>

          <div className="checkout-grand-total">
            <strong>Total</strong>
            <strong>{inr(total)}</strong>
          </div>
        </div>

        <button type="submit" className="checkout-place-order">
          <LockKeyhole size={21} />
          Place Order
        </button>

        <div className="checkout-assurances">
          <span><ShieldCheck /> Secure Payment</span>
          <span><RefreshCw /> Easy Returns</span>
          <span><Truck /> Order Tracking</span>
        </div>
      </aside>
    </form>
  );
}