# FitKart
React + Vite storefront with FitMatch, a rule-based demo size recommender.

## Run
```
npm install
npm run dev
```
Open the URL Vite prints (usually http://localhost:5173).

## Routes
`/` home · `/shop` · `/product/:id` · `/fitmatch` · `/checkout` · `/wishlist` · `/account` · `/sign-in` · `/sign-up` · `/admin`
Cart is a drawer (open from the navbar). Discount code: `FIT10`.

## Later integrations
- **Clerk**: wrap `<BrowserRouter>` in `main.jsx` with `<ClerkProvider>`, then swap `AuthForm` in `src/pages/Auth.jsx` for Clerk's `<SignIn/>` / `<SignUp/>`. Put only the publishable key in `.env` (see `.env.example`).
- **Razorpay**: add the payment step in `src/pages/Checkout.jsx` (the demo collects no payment details).

## Notes
All data is mock (`src/data/products.js`). Cart and wishlist persist in localStorage. Product images come from Unsplash; a text placeholder appears if one fails to load. Admin and account screens are demo UI with no security or backend.
