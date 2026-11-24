import { useState } from 'react';
export default function SafeImage({ src, alt, ...rest }) {
  const [bad, setBad] = useState(false);
  if (bad) return <div className="img-fallback" role="img" aria-label={alt}><span>{alt}</span></div>;
  return <img src={src} alt={alt} loading="lazy" onError={() => setBad(true)} {...rest} />;
}
