export default function SizeSelector({ sizes, value, onChange, error }) {
  return (
    <div role="radiogroup" aria-label="Size" className={`chips ${error ? 'err' : ''}`}>
      {sizes.map((s) => (
        <button type="button" key={s} role="radio" aria-checked={value === s} className={`chip ${value === s ? 'on' : ''}`} onClick={() => onChange(s)}>{s}</button>
      ))}
    </div>
  );
}
