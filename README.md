# Coffee House — UI updates

## What's new ✅
- Added **Menu view toggles** (Grid / Large / List) on the main menu section.
- Persisted user choice in `localStorage` under key: `menuView`.

UI update: The view control is now a **single small icon** in the header (compact toggle). Clicking the icon will **cycle** the views (Grid → Large → List); a short toast indicates the current mode. This keeps the header minimal and tidy.
- New CSS classes to control layout:
  - `.product-grid.view-grid` — default compact grid
  - `.product-grid.view-large` — larger tile cards
  - `.product-grid.view-list` — horizontal list items
- Minor UI polish: updated button styles, hover/active effects, and improved focus states for accessibility.

## Files changed
- `index.html` — added view controls markup
- `assets/css/style.css` — added view styles and UI polish
- `assets/js/app.js` — added view toggle logic and persistence
 - `product.html` — product detail with options (sugar / ice / toppings)
 - `register.html`, `login.html`, `account.html` — simple client-side auth and profile
 - `database.sql` — extended schema for `Users` and `Option` tables

## How to change the default view
- Default is `grid`. To change default, edit the `saved` fallback in `setupViewControls()` in `assets/js/app.js` (replace `'grid'` with `'list'` or `'large'`), or run in the console:

```js
localStorage.setItem('menuView', 'list');
// then reload the page
```

## Notes
- Buttons are keyboard-accessible and include focus styles.
- Responsive behavior is added so `view-large` falls back to single-column on narrow screens and `view-list` stacks vertically on mobile.

If you'd like, I can:
- Extract the header into an include/partial for easier maintenance, or
- Add animated transitions between view modes.

### Authentication & Member Points 🔐
- Client-side register/login implemented (localStorage) for demo: `register.html`, `login.html`, `account.html`.
- Users are stored in `localStorage` key `users`. Current user id is stored in `currentUser`.
- Checkout button (`THANH TOÁN`) awards points (1 point per 10,000đ) to logged-in users.

### Database & deployment notes 🗄️
- `database.sql` now contains `Users`, `OptionTypes`, `OptionValues`, and `ProductOptionValues` to support server-side data and migration.
- For production you should replace client-side auth with server endpoints and securely hash passwords (bcrypt) before storing.
- If you'd like, I can scaffold a simple Node/Express API and migration script or a Docker setup for local testing.
