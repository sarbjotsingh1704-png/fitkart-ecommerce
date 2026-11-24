import { useState } from 'react';
import { Shirt, Footprints, Info } from 'lucide-react';
const CL = ['S', 'M', 'L', 'XL', 'XXL'];
const CHART = [['S', '86–91', '72–77'], ['M', '92–99', '78–85'], ['L', '100–107', '86–93'], ['XL', '108–115', '94–101'], ['XXL', '116+', '102+']];
const FOOT = [[24.5, '6'], [25.4, '7'], [26.2, '8'], [27, '9'], [27.9, '10'], [28.8, '11']];
const RULES = { clothing: [['chest', 'Chest (cm)', 70, 140], ['waist', 'Waist (cm)', 55, 130], ['height', 'Height (cm)', 140, 210], ['weight', 'Weight (kg)', 35, 160]], footwear: [['foot', 'Foot length (cm)', 20, 33]] };
export function recommend(type, m, fit) {
  const why = []; let conf = 70, size;
  if (type === 'footwear') {
    const len = parseFloat(m.foot) + (fit === 'relaxed' ? 0.4 : 0);
    size = (FOOT.find(([c]) => len <= c) || [0, '11'])[1];
    why.push(`Your foot length of ${m.foot} cm maps to UK/India size ${size} on our chart.`);
    if (fit === 'relaxed') why.push('Relaxed fit adds about 4 mm of room.');
  } else {
    const c = +m.chest; let i = c < 92 ? 0 : c < 100 ? 1 : c < 108 ? 2 : c < 116 ? 3 : 4;
    why.push(`A chest of ${c} cm falls in size ${CL[i]}.`);
    const wLimit = [84, 92, 100, 108, 999][i];
    if (+m.waist > wLimit && i < 4) { i++; why.push(`Your waist of ${m.waist} cm is above the ${CL[i - 1]} range, so we sized up.`); conf -= 10; }
    if (fit === 'slim' && i > 0) { i--; why.push('Slim fit: one size down for a closer cut.'); }
    if (fit === 'relaxed' && i < 4) { i++; why.push('Relaxed fit: one size up for extra room.'); }
    size = CL[i];
    if (+m.height > 188 && i < 4) conf -= 5;
  }
  if (m.usual) { if (String(m.usual).toUpperCase() === size) { conf += 20; why.push(`This matches your usual size (${m.usual}).`); } else { conf -= 10; why.push(`Your usual size is ${m.usual}; compare with the size chart.`); } }
  return { size, conf: Math.max(35, Math.min(95, conf)), why };
}
export function SizeChart({ type }) {
  return type === 'footwear' ? (
    <table className="tbl"><thead><tr><th>Size (UK/IN)</th><th>Foot length (cm)</th></tr></thead><tbody>{FOOT.map(([c, s], i) => <tr key={s}><td>{s}</td><td>{i ? FOOT[i - 1][0] + 0.1 : 23.6}–{c}</td></tr>)}</tbody></table>
  ) : (
    <table className="tbl"><thead><tr><th>Size</th><th>Chest (cm)</th><th>Waist (cm)</th></tr></thead><tbody>{CHART.map((r) => <tr key={r[0]}>{r.map((c) => <td key={c}>{c}</td>)}</tr>)}</tbody></table>
  );
}
export default function FitMatch({ defaultType, onApply, sizes }) {
  const [step, setStep] = useState(defaultType ? 2 : 1);
  const [type, setType] = useState(defaultType || '');
  const [m, setM] = useState({ usual: '' });
  const [fit, setFit] = useState('regular');
  const [errs, setErrs] = useState({});
  const [showChart, setShowChart] = useState(false);
  const validate = () => {
    const e = {};
    RULES[type].forEach(([k, l, lo, hi]) => { const v = parseFloat(m[k]); if (!v || v < lo || v > hi) e[k] = `Enter ${l.toLowerCase()} between ${lo} and ${hi}`; });
    setErrs(e); return !Object.keys(e).length;
  };
  const res = step === 4 ? recommend(type, m, fit) : null;
  const fits = res && sizes ? sizes.includes(res.size) : true;
  return (
    <div className="fitmatch">
      <p className="demo-note"><Info size={16} /> Demo recommendation based on simple size-chart rules. It is not an AI model and can't guarantee a perfect fit.</p>
      <ol className="steps" aria-label="Progress">{['Type', 'Measure', 'Fit', 'Result'].map((s, i) => <li key={s} className={step > i ? 'done' : ''} aria-current={step === i + 1}>{s}</li>)}</ol>
      {step === 1 && <div className="choice">{[['clothing', Shirt, 'Clothing'], ['footwear', Footprints, 'Footwear']].map(([k, I, l]) => <button key={k} className={`pick ${type === k ? 'on' : ''}`} onClick={() => { setType(k); setStep(2); }}><I size={30} />{l}</button>)}</div>}
      {step === 2 && (
        <form onSubmit={(e) => { e.preventDefault(); if (validate()) setStep(3); }} noValidate>
          {RULES[type].map(([k, l]) => <label key={k} className="field">{l}<input type="number" inputMode="decimal" value={m[k] || ''} onChange={(e) => setM({ ...m, [k]: e.target.value })} aria-invalid={!!errs[k]} />{errs[k] && <em className="error">{errs[k]}</em>}</label>)}
          <label className="field">Usual size (optional)<input value={m.usual} onChange={(e) => setM({ ...m, usual: e.target.value })} placeholder={type === 'footwear' ? 'e.g. 9' : 'e.g. M'} /></label>
          <div className="row"><button type="button" className="btn ghost" onClick={() => (defaultType ? setStep(2) : setStep(1))} hidden={!!defaultType}>Back</button><button className="btn primary">Next</button></div>
        </form>
      )}
      {step === 3 && <div><div className="choice">{[['slim', 'Slim', 'Closer to the body'], ['regular', 'Regular', 'True to size'], ['relaxed', 'Relaxed', 'Extra room']].map(([k, l, d]) => <button key={k} className={`pick ${fit === k ? 'on' : ''}`} onClick={() => setFit(k)}><b>{l}</b><small>{d}</small></button>)}</div><div className="row"><button className="btn ghost" onClick={() => setStep(2)}>Back</button><button className="btn primary" onClick={() => setStep(4)}>See my size</button></div></div>}
      {step === 4 && res && (
        <div className="result">
          <p>Recommended size</p><div className="big-size">{res.size}</div>
          <div className="meter" role="img" aria-label={`Confidence ${res.conf}%`}><i style={{ width: `${res.conf}%` }} /></div>
          <small>Confidence: {res.conf >= 80 ? 'High' : res.conf >= 60 ? 'Medium' : 'Low'} ({res.conf}%)</small>
          <ul className="why">{res.why.map((w) => <li key={w}>{w}</li>)}</ul>
          {!fits && <p className="error">This product isn't sold in size {res.size}. Check the size chart.</p>}
          <div className="row">
            <button className="btn ghost" onClick={() => setStep(2)}>Change measurements</button>
            <button className="btn ghost" onClick={() => setShowChart(!showChart)}>{showChart ? 'Hide' : 'View'} size chart</button>
            {onApply && fits && <button className="btn primary" onClick={() => onApply(res.size)}>Use size {res.size}</button>}
          </div>
          {showChart && <SizeChart type={type} />}
        </div>
      )}
    </div>
  );
}
