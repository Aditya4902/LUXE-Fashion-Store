/* =====================================================
   LUXE Fashion Store
   Author  : Aditya | github.com/Aditya4902
   File    : server.js
   Desc    : REST API — Node.js + Express backend
   Run     : node server.js
   URL     : http://localhost:3000
   ===================================================== */

'use strict';

const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;
const DB   = path.join(__dirname, 'data', 'db.json');

/* ------------------------------------------------
   Middleware
   ------------------------------------------------ */
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));   // serves index.html + assets

/* ------------------------------------------------
   DB helpers — simple JSON file as mock database
   ------------------------------------------------ */
const readDB  = ()     => JSON.parse(fs.readFileSync(DB, 'utf8'));
const writeDB = (data) => fs.writeFileSync(DB, JSON.stringify(data, null, 2));

/* ------------------------------------------------
   Routes — Products
   ------------------------------------------------ */

// GET /api/products
// Query params: ?category=women &sort=pl &search=dress
app.get('/api/products', (req, res) => {
  try {
    const { category, sort, search } = req.query;
    let { products } = readDB();

    if (category && category !== 'all') {
      products = products.filter((p) => p.cat === category);
    }

    if (search) {
      const q = search.toLowerCase();
      products = products.filter((p) =>
        p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q)
      );
    }

    if (sort === 'pl') products.sort((a, b) => a.price  - b.price);
    if (sort === 'ph') products.sort((a, b) => b.price  - a.price);
    if (sort === 'ra') products.sort((a, b) => b.rating - a.rating);
    if (sort === 'nm') products.sort((a, b) => a.name.localeCompare(b.name));

    res.json({ success: true, count: products.length, data: products });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  try {
    const { products } = readDB();
    const product = products.find((p) => p.id === parseInt(req.params.id));

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ------------------------------------------------
   Routes — Cart
   ------------------------------------------------ */

// GET /api/cart
app.get('/api/cart', (req, res) => {
  try {
    const { cart } = readDB();
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    res.json({ success: true, data: cart, total, count: cart.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/cart  — add item
app.post('/api/cart', (req, res) => {
  try {
    const { productId, qty = 1 } = req.body;
    const db      = readDB();
    const product = db.products.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const existing = db.cart.find((item) => item.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      db.cart.push({ ...product, qty });
    }

    writeDB(db);
    res.json({ success: true, message: 'Item added to cart', data: db.cart });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/cart/:id  — update quantity
app.put('/api/cart/:id', (req, res) => {
  try {
    const { qty } = req.body;
    const db   = readDB();
    const item = db.cart.find((i) => i.id === parseInt(req.params.id));

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not in cart' });
    }

    if (qty <= 0) {
      db.cart = db.cart.filter((i) => i.id !== parseInt(req.params.id));
    } else {
      item.qty = qty;
    }

    writeDB(db);
    res.json({ success: true, message: 'Cart updated', data: db.cart });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/cart/:id  — remove item
app.delete('/api/cart/:id', (req, res) => {
  try {
    const db = readDB();
    db.cart  = db.cart.filter((item) => item.id !== parseInt(req.params.id));
    writeDB(db);
    res.json({ success: true, message: 'Item removed', data: db.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ------------------------------------------------
   Routes — Orders
   ------------------------------------------------ */

// POST /api/orders  — place order (clears cart)
app.post('/api/orders', (req, res) => {
  try {
    const db = readDB();

    if (!db.cart.length) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const order = {
      id        : Date.now(),
      items     : [...db.cart],
      total     : db.cart.reduce((sum, item) => sum + item.price * item.qty, 0),
      status    : 'confirmed',
      createdAt : new Date().toISOString(),
    };

    db.orders.push(order);
    db.cart = [];
    writeDB(db);

    res.status(201).json({ success: true, message: 'Order placed!', data: order });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders
app.get('/api/orders', (req, res) => {
  try {
    const { orders } = readDB();
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ------------------------------------------------
   Start server
   ------------------------------------------------ */
app.listen(PORT, () => {
  console.log(`\n  LUXE server running → http://localhost:${PORT}\n`);
  console.log('  Endpoints:');
  console.log('    GET    /api/products');
  console.log('    GET    /api/products/:id');
  console.log('    GET    /api/cart');
  console.log('    POST   /api/cart');
  console.log('    PUT    /api/cart/:id');
  console.log('    DELETE /api/cart/:id');
  console.log('    POST   /api/orders');
  console.log('    GET    /api/orders\n');
});
