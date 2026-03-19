/* =====================================================
   LUXE Fashion Store
   Author  : Aditya | github.com/Aditya4902
   File    : js/cart.js
   Desc    : Cart state management — add, remove,
             quantity control, render, checkout
   ===================================================== */

'use strict';

let cart = [];

/* ================================================
   ADD TO CART
   ================================================ */
function addToCart(id, e) {
  if (e) e.stopPropagation();

  const product  = PRODUCTS.find((p) => p.id === id);
  const existing = cart.find((p) => p.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartBadge();
  renderCart();
  showToast(`${product.name} added ✓`);

  /* API call — works when backend (server.js) is running */
  fetch('/api/cart', {
    method  : 'POST',
    headers : { 'Content-Type': 'application/json' },
    body    : JSON.stringify({ productId: id, qty: 1 }),
  }).catch(() => {
    /* Graceful fallback — site works offline without backend */
  });
}

/* ================================================
   REMOVE FROM CART
   ================================================ */
function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCartBadge();
  renderCart();

  fetch(`/api/cart/${id}`, { method: 'DELETE' }).catch(() => {});
}

/* ================================================
   CHANGE QUANTITY
   ================================================ */
function changeQty(id, delta) {
  const item = cart.find((p) => p.id === id);
  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    removeFromCart(id);
  } else {
    updateCartBadge();
    renderCart();

    fetch(`/api/cart/${id}`, {
      method  : 'PUT',
      headers : { 'Content-Type': 'application/json' },
      body    : JSON.stringify({ qty: item.qty }),
    }).catch(() => {});
  }
}

/* ================================================
   UPDATE BADGE COUNT
   ================================================ */
function updateCartBadge() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('cartBadge').textContent = count;
}

/* ================================================
   RENDER CART SIDEBAR
   ================================================ */
function renderCart() {
  const itemsEl  = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');

  if (!cart.length) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛍</div>
        <p>Your cart is empty</p>
        <span style="font-size:13px">Add some items to get started</span>
      </div>`;
    footerEl.style.display = 'none';
    return;
  }

  footerEl.style.display = 'block';

  itemsEl.innerHTML = cart.map((item) => `
    <div class="cart-item">
      <div class="cart-item-img" style="background: ${item.bg}">${item.emoji}</div>
      <div class="cart-item-body">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-cat">${item.cat}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span style="font-size:14px; font-weight:600; min-width:20px; text-align:center">
            ${item.qty}
          </span>
          <button class="qty-btn" onclick="changeQty(${item.id}, +1)">+</button>
          <span class="cart-item-price">₹${(item.price * item.qty).toLocaleString()}</span>
          <button class="cart-item-remove" onclick="removeFromCart(${item.id})">×</button>
        </div>
      </div>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById('cartTotal').textContent = '₹' + total.toLocaleString();
}

/* ================================================
   TOGGLE CART SIDEBAR
   ================================================ */
function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
  renderCart();
}

/* ================================================
   CHECKOUT
   ================================================ */
function checkout() {
  fetch('/api/orders', { method: 'POST' }).catch(() => {});

  showToast('🎉 Order placed successfully!');
  cart = [];
  updateCartBadge();
  renderCart();
  toggleCart();
}
