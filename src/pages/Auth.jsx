import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Gem, Truck, ShieldCheck, Heart, Package, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import heroImg from '../assets/login image.png';
import './Auth.css';
import './AuthPage.css';

// Layout only. Later replace <AuthForm/> with Clerk's <SignIn /> / <SignUp /> from @clerk/clerk-react.
// Sign-in/up is still a demo: submitting shows the same notice as before and stores nothing.
const DEMO_MSG = 'Demo UI only — connect Clerk to enable sign-in';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function AuthShell({ variant, hero, perks, card, children }) {
  return (
    <section className={`fk-auth fk-auth--${variant}`}>
      <div className="fk-auth__hero">
        <img className="fk-auth__img" src={heroImg} alt="" decoding="async" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        <div className="fk-auth__copy">
          <p className="fk-eyebrow">{hero.eyebrow}</p>
          <h2 className="fk-title"><span>{hero.line1}</span> <em>{hero.line2}</em></h2>
          <p className="fk-lead">{hero.lead}</p>
          <ul className="fk-perks">
            {perks.map(([Icon, label]) => (
              <li key={label}><span className="fk-perk-ic"><Icon size={22} strokeWidth={1.8} aria-hidden="true" /></span><span>{label}</span></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="fk-auth__card">
        <p className="fk-card-eyebrow">{card.eyebrow}</p>
        <h1>{card.title}</h1>
        <p className="fk-card-sub">{card.sub}</p>
        {children}
        <p className="fk-alt">{card.alt}</p>
      </div>
    </section>
  );
}

function Field({ id, label, icon: Icon, error, trailing, inputRef, ...input }) {
  return (
    <div className={`fk-field${error ? ' has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <div className="fk-input">
        <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
        <input id={id} ref={inputRef} aria-invalid={error ? 'true' : undefined} aria-describedby={error ? `${id}-err` : undefined} {...input} />
        {trailing}
      </div>
      {error && <p className="fk-err" id={`${id}-err`} role="alert">{error}</p>}
    </div>
  );
}

function PasswordField({ id, label, error, inputRef, ...input }) {
  const [show, setShow] = useState(false);
  return (
    <Field id={id} label={label} icon={Lock} error={error} inputRef={inputRef} type={show ? 'text' : 'password'} {...input}
      trailing={<button type="button" className="fk-eye" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show}>{show ? <Eye size={19} /> : <EyeOff size={19} />}</button>} />
  );
}

function AuthForm({ signup }) {
  const { notify } = useStore();
  const [v, setV] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const refs = { name: useRef(), email: useRef(), password: useRef(), confirm: useRef() };
  const set = (k) => (e) => { setV((s) => ({ ...s, [k]: e.target.value })); if (errors[k]) setErrors((s) => ({ ...s, [k]: undefined })); };

  const validate = () => {
    const e = {};
    if (signup && !v.name.trim()) e.name = 'Please enter your full name.';
    if (!v.email.trim()) e.email = 'Please enter your email address.';
    else if (!EMAIL_RE.test(v.email.trim())) e.email = 'Enter a valid email address.';
    if (!v.password) e.password = signup ? 'Create a password.' : 'Please enter your password.';
    else if (signup && v.password.length < 8) e.password = 'Use at least 8 characters.';
    if (signup) { if (!v.confirm) e.confirm = 'Please confirm your password.'; else if (v.confirm !== v.password) e.confirm = 'Passwords do not match.'; }
    return e;
  };
  const submit = (ev) => {
    ev.preventDefault();
    const e = validate(); setErrors(e);
    const first = ['name', 'email', 'password', 'confirm'].find((k) => e[k]);
    if (first) return refs[first].current?.focus();
    notify(DEMO_MSG);
  };

  return (
    <form onSubmit={submit} noValidate>
      {signup && <Field id="auth-name" label="Full name" icon={User} inputRef={refs.name} value={v.name} onChange={set('name')} error={errors.name} autoComplete="name" placeholder="Enter your full name" />}
      <Field id="auth-email" label="Email" icon={Mail} inputRef={refs.email} type="email" value={v.email} onChange={set('email')} error={errors.email} autoComplete="email" placeholder="Enter your email address" />
      <PasswordField id="auth-password" label="Password" inputRef={refs.password} value={v.password} onChange={set('password')} error={errors.password} autoComplete={signup ? 'new-password' : 'current-password'} placeholder={signup ? 'Create a password' : 'Enter your password'} />
      {signup && <PasswordField id="auth-confirm" label="Confirm password" inputRef={refs.confirm} value={v.confirm} onChange={set('confirm')} error={errors.confirm} autoComplete="new-password" placeholder="Re-enter your password" />}
      {!signup && <div className="fk-forgot"><button type="button" className="fk-linkbtn" onClick={() => notify('Password reset will be available once sign-in is connected')}>Forgot password?</button></div>}
      <button className="fk-submit" type="submit">{signup ? 'Create account' : 'Sign in'} <ArrowRight size={18} aria-hidden="true" /></button>
      <p className="fk-demo">No real authentication yet. This form stores nothing.</p>
    </form>
  );
}

export const SignInPage = () => (
  <AuthShell variant="login"
    hero={{ eyebrow: 'Style • Comfort • Confidence', line1: 'Wear What', line2: 'Moves You.', lead: 'Explore the latest fashion, sneakers and accessories — all in one place.' }}
    perks={[[Gem, 'Trendy Collection'], [Truck, 'Fast & Reliable Delivery'], [ShieldCheck, 'Secure Shopping']]}
    card={{ eyebrow: 'Sign in to FitKart', title: 'Welcome Back', sub: 'Continue your style journey with your account.', alt: <>New here? <Link to="/sign-up">Create an account</Link></> }}>
    <AuthForm />
  </AuthShell>
);
export const SignUpPage = () => (
  <AuthShell variant="signup"
    hero={{ eyebrow: 'Streetwear / Sneakers / Everyday style', line1: 'Find Your Fit.', line2: 'Own Your Style.', lead: 'Create your FitKart account and make every purchase easier.' }}
    perks={[[Heart, 'Save Your Sizes'], [Package, 'Track Your Orders'], [Zap, 'Faster Checkout']]}
    card={{ eyebrow: 'Welcome to FitKart', title: 'Create Your Account', sub: 'Join FitKart and discover your style.', alt: <>Already have an account? <Link to="/sign-in">Sign in</Link></> }}>
    <AuthForm signup />
  </AuthShell>
);
