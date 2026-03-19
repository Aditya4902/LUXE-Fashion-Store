# LUXE — Premium Fashion Store

> Full stack e-commerce fashion store with 3D interactive product cards, custom animated cursor, particle effects, cart sidebar, quick-view modal and a Node.js/Express REST API backend.

🔗 **Live Demo** → https://Aditya4902.github.io/luxe/

---

## Project Structure

```
luxe/
├── index.html          Main HTML — page structure
├── server.js           Node.js + Express REST API
├── package.json
├── .gitignore
│
├── css/
│   └── style.css       All styles, variables, animations
│
├── js/
│   ├── data.js         Product catalogue data
│   ├── ui.js           Cursor, particles, marquee, toast, scroll
│   ├── products.js     Render, filter, sort, search, tilt, modal, wishlist
│   ├── cart.js         Cart state — add, remove, qty, checkout
│   └── app.js          Entry point — boots the application
│
└── data/
    └── db.json         Mock database (products, cart, orders)
```

---

## Features

**Frontend**
- Animated loading screen with shimmer gradient
- Full-screen hero with glowing radial effects and grid background
- Infinite colour gradient marquee ticker
- 12 product cards with unique gradient backgrounds
- 3D card tilt effect on hover (CSS perspective transform)
- Hover overlay with Add to Cart, Wishlist and Quick View
- Slide-in cart sidebar with quantity controls
- Quick View product modal with description and ratings
- Live search, category filters and sort options
- Wishlist toggle per product
- Custom animated cursor with glowing ring
- 28 floating colour particles in the background
- Scroll-triggered section reveal animations
- Toast notifications
- Fully responsive

**Backend (Node.js + Express)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | All products — supports `?category=` `?sort=` `?search=` |
| GET | `/api/products/:id` | Single product |
| GET | `/api/cart` | View cart |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/:id` | Update quantity |
| DELETE | `/api/cart/:id` | Remove item |
| POST | `/api/orders` | Place order — clears cart |
| GET | `/api/orders` | All orders |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | JSON file — no setup required |
| Fonts | Playfair Display + Syne (Google Fonts) |

---

## How to Run

**Option 1 — Frontend only (no setup needed)**
Open `index.html` directly in any browser. Everything works offline.

**Option 2 — Full Stack with backend**
```bash
npm install
node server.js
# Open http://localhost:3000
```

**Option 3 — Dev mode**
```bash
npm run dev
```

---

## Resume Bullet Points

- Built a full stack e-commerce store with HTML/CSS/JS frontend and Node.js + Express backend with 8 REST API endpoints
- Implemented 3D card tilt, custom animated cursor with glowing ring and floating particle system using vanilla JavaScript
- Developed live search, category filters, sort, wishlist, quick-view modal and animated cart sidebar
- Deployed on GitHub Pages — works 100% offline with graceful backend fallback

---

## Author

**Aditya** · [GitHub](https://github.com/Aditya4902)
