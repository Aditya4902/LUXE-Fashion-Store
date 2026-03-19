/* =====================================================
   LUXE Fashion Store
   Author  : Aditya | github.com/Aditya4902
   File    : js/products.js
   Desc    : Product rendering, filtering, sorting,
             searching, 3D tilt, wishlist & quick-view
   ===================================================== */

'use strict';

let filtered = [...PRODUCTS];
let wishlist = new Set();

/* ================================================
   RENDER
   ================================================ */
function renderProducts(list) {
  const grid = document.getElementById('productGrid');
  document.getElementById('rInfo').textContent =
    `${list.length} product${list.length !== 1 ? 's' : ''}`;

  grid.innerHTML = list.map((p, i) => {
    const stars     = '★'.repeat(Math.floor(p.rating)) + '☆'.repeat(5 - Math.floor(p.rating));
    const disc      = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
    const badgeHTML = p.badge ? `<span class="pbadge b-${p.badge}">${p.badge}</span>` : '';
    const oldHTML   = p.old
      ? `<span class="pc-old-price">₹${p.old.toLocaleString()}</span>
         <span class="pc-discount">-${disc}%</span>`
      : '';
    const liked = wishlist.has(p.id);

    return `
      <div class="pcard"
           style="animation: fadeUp 0.5s ease ${i * 0.06}s both"
           onmousemove="tiltCard(this, event)"
           onmouseleave="resetTilt(this)">

        <div class="pcard-img" style="background: ${p.bg}">
          <div class="pcard-placeholder">${p.emoji}</div>
          ${badgeHTML}
          <div class="pcard-overlay">
            <button class="ov-add"  onclick="addToCart(${p.id}, event)">Add to Cart</button>
            <div class="ov-row">
              <button class="ov-wish ${liked ? 'liked' : ''}"
                      onclick="toggleWishlist(${p.id}, this, event)">
                ${liked ? '♥ Liked' : '♡ Wishlist'}
              </button>
              <button class="ov-view" onclick="openModal(${p.id}, event)">Quick View</button>
            </div>
          </div>
        </div>

        <div class="pcard-info">
          <p class="pc-cat">${p.cat}</p>
          <h3 class="pc-name">${p.name}</h3>
          <div class="pc-price-row">
            <span class="pc-price">₹${p.price.toLocaleString()}</span>
            ${oldHTML}
          </div>
          <div class="pc-stars">
            <span>${stars}</span>
            <small>${p.rating} (${p.reviews})</small>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* ================================================
   3D CARD TILT
   ================================================ */
function tiltCard(el, e) {
  const rect = el.getBoundingClientRect();
  const x    = ((e.clientX - rect.left) / rect.width  - 0.5) * 20;
  const y    = -((e.clientY - rect.top)  / rect.height - 0.5) * 20;
  el.style.transform  = `perspective(900px) rotateY(${x}deg) rotateX(${y}deg) scale(1.04)`;
  el.style.transition = 'transform 0.05s';
}

function resetTilt(el) {
  el.style.transform  = 'perspective(900px) rotateY(0deg) rotateX(0deg) scale(1)';
  el.style.transition = 'transform 0.5s ease';
}

/* ================================================
   FILTER
   ================================================ */
function filterBy(category, btn) {
  document.querySelectorAll('.fp, .nav-link').forEach((el) => el.classList.remove('active'));
  if (btn) btn.classList.add('active');

  filtered = category === 'all'
    ? [...PRODUCTS]
    : PRODUCTS.filter((p) => p.cat === category);

  renderProducts(filtered);
  scrollToProducts();
}

/* ================================================
   SORT
   ================================================ */
function sortProducts(value) {
  const list = [...filtered];

  const sorters = {
    pl : (a, b) => a.price  - b.price,
    ph : (a, b) => b.price  - a.price,
    ra : (a, b) => b.rating - a.rating,
    nm : (a, b) => a.name.localeCompare(b.name),
  };

  if (sorters[value]) list.sort(sorters[value]);
  renderProducts(list);
}

/* ================================================
   SEARCH
   ================================================ */
function searchProducts(query) {
  const q = query.toLowerCase().trim();
  const results = PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(q) ||
    p.cat.toLowerCase().includes(q)
  );
  renderProducts(results);
}

/* ================================================
   WISHLIST
   ================================================ */
function toggleWishlist(id, btn, e) {
  if (e) e.stopPropagation();

  if (wishlist.has(id)) {
    wishlist.delete(id);
    btn.textContent = '♡ Wishlist';
    btn.classList.remove('liked');
  } else {
    wishlist.add(id);
    btn.textContent = '♥ Liked';
    btn.classList.add('liked');
    showToast('Added to wishlist ♥');
  }
}

/* ================================================
   QUICK VIEW MODAL
   ================================================ */
function openModal(id, e) {
  if (e) e.stopPropagation();

  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;

  document.getElementById('modalEmoji').textContent          = p.emoji;
  document.getElementById('modalImgWrap').style.background   = p.bg;
  document.getElementById('modalCat').textContent            = p.cat.toUpperCase();
  document.getElementById('modalName').textContent           = p.name;
  document.getElementById('modalPrice').textContent          = '₹' + p.price.toLocaleString();
  document.getElementById('modalOldPrice').textContent       = p.old ? '₹' + p.old.toLocaleString() : '';
  document.getElementById('modalDesc').textContent           = p.desc;
  document.getElementById('modalRating').innerHTML =
    `<span style="color:var(--gold); font-size:16px">${'★'.repeat(Math.floor(p.rating))}</span>
     <span style="color:var(--muted); font-size:13px; margin-left:6px">
       ${p.rating} · ${p.reviews} reviews
     </span>`;

  document.getElementById('modalAddBtn').onclick = () => {
    addToCart(p.id, null);
    document.getElementById('modalBg').classList.remove('open');
  };

  document.getElementById('modalBg').classList.add('open');
}

function closeModal(e) {
  if (e.target === document.getElementById('modalBg')) {
    document.getElementById('modalBg').classList.remove('open');
  }
}
