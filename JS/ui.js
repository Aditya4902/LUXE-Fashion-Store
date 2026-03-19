/* =====================================================
   LUXE Fashion Store
   Author  : Aditya | github.com/Aditya4902
   File    : js/ui.js
   Desc    : UI effects — cursor, particles, marquee,
             toast notifications, scroll behaviour
   ===================================================== */

'use strict';

/* ================================================
   CUSTOM CURSOR
   ================================================ */
const cursorDot  = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');

let mouseX = 0;
let mouseY = 0;
let ringX  = 0;
let ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}

animateRing();

document.addEventListener('mouseover', (e) => {
  if (!e.target.matches('button, a, input, select')) return;
  cursorDot.style.width        = '20px';
  cursorDot.style.height       = '20px';
  cursorRing.style.width       = '56px';
  cursorRing.style.height      = '56px';
  cursorRing.style.borderColor = 'rgba(255, 77, 141, 0.9)';
});

document.addEventListener('mouseout', (e) => {
  if (!e.target.matches('button, a, input, select')) return;
  cursorDot.style.width        = '12px';
  cursorDot.style.height       = '12px';
  cursorRing.style.width       = '40px';
  cursorRing.style.height      = '40px';
  cursorRing.style.borderColor = 'rgba(255, 77, 141, 0.5)';
});

/* ================================================
   BACKGROUND PARTICLES
   ================================================ */
const PARTICLE_COLORS = ['#ff4d8d', '#00e5ff', '#b06cff', '#ffd166', '#00ff94'];

function initParticles() {
  const container = document.getElementById('particles');

  for (let i = 0; i < 28; i++) {
    const el    = document.createElement('div');
    const size  = Math.random() * 5 + 2;
    const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];

    el.className  = 'particle';
    el.style.cssText = [
      `width: ${size}px`,
      `height: ${size}px`,
      `left: ${Math.random() * 100}%`,
      `background: ${color}`,
      `animation-duration: ${8 + Math.random() * 14}s`,
      `animation-delay: ${Math.random() * 10}s`,
    ].join('; ');

    container.appendChild(el);
  }
}

/* ================================================
   MARQUEE STRIP
   ================================================ */
const MARQUEE_LABELS = [
  'New Collection', 'Free Shipping',  'Premium Quality',
  'Easy Returns',   'Trending Now',   'Flash Sale',
  'Top Brands',     'Secure Payment',
];

function initMarquee() {
  const track = document.getElementById('marqueeTrack');
  const html  = MARQUEE_LABELS
    .map(label => `<span class="marquee-item">${label}</span><span class="marquee-item" style="opacity:0.4">✦</span>`)
    .join('');
  track.innerHTML = html + html;  // duplicate for seamless infinite scroll
}

/* ================================================
   TOAST NOTIFICATION
   ================================================ */
let toastTimer = null;

function showToast(message) {
  const toastEl = document.getElementById('toast');
  document.getElementById('toastMessage').textContent = message;

  toastEl.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2800);
}

/* ================================================
   SCROLL BEHAVIOUR
   ================================================ */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* Scroll reveal for sections */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ================================================
   HELPERS
   ================================================ */
function scrollToProducts() {
  document.getElementById('productsSection').scrollIntoView({ behavior: 'smooth' });
}
