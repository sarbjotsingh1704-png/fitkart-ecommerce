export const inr = (n) => `₹${n.toLocaleString('en-IN')}`;
export default function PriceDisplay({ price, mrp }) {
  const off = mrp > price ? Math.round((1 - price / mrp) * 100) : 0;
  return (
    <p className="price">
      <strong>{inr(price)}</strong>
      {off > 0 && <><s>{inr(mrp)}</s><span className="off">{off}% off</span></>}
    </p>
  );
}
