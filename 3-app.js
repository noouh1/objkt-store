/* ════════════════════════════════════════════
   OBJKT® — front-end demo store
   plain JS: cart state, hash routing, quick view,
   mock checkout. No backend, no framework.
   ════════════════════════════════════════════ */
"use strict";

/* ── catalog ─────────────────────────────── */
const PRODUCTS = [
  {
    id: "orbit", name: "Orbit Earbuds", tag: "AUDIO / IN-EAR", price: 129,
    img: "p1.jpg", badge: "BEST SELLER",
    blurb: "Tiny pebble case, 32 hours of total playtime, and a tuning curve we argued about for four months. They disappear in your ears and stay out of your way.",
    specs: [["DRIVER", "11mm dynamic"], ["BATTERY", "8h + 24h case"], ["RATING", "IPX5"], ["WEIGHT", "4.1g per bud"]]
  },
  {
    id: "monolith", name: "Monolith Lamp", tag: "DESK / LIGHT", price: 189,
    img: "p2.jpg",
    blurb: "One arm, one joint, one perfect circle of light. Machined aluminum, stepless dimming, and a color temperature dial from candlelight to noon.",
    specs: [["OUTPUT", "800 lm"], ["CCT", "2700–6500K"], ["BODY", "Anodized aluminum"], ["POWER", "USB-C, 12W"]]
  },
  {
    id: "tactile", name: "Tactile 75", tag: "DESK / KEYBOARD", price: 159,
    img: "p3.jpg", badge: "NEW",
    blurb: "A 75% board with factory-lubed linear switches, a gasket mount, and keycaps the color of good paper. Thock included at no extra charge.",
    specs: [["LAYOUT", "75% / 84 keys"], ["SWITCHES", "Linear, hot-swap"], ["CONNECT", "BT 5.1 / 2.4G / USB-C"], ["BATTERY", "4000 mAh"]]
  },
  {
    id: "halo", name: "Halo Speaker", tag: "AUDIO / HOME", price: 249,
    img: "p4.jpg",
    blurb: "A fabric-wrapped cylinder tuned for rooms, not spec sheets. Warm mids, honest bass, and a top plate you tap once to pause the world.",
    specs: [["DRIVERS", "3.5\" + dual passive"], ["INPUTS", "BT 5.3 / AUX / Wi-Fi"], ["BODY", "Recycled fabric mesh"], ["WEIGHT", "1.9 kg"]]
  },
  {
    id: "field", name: "Field Cell 20K", tag: "CARRY / POWER", price: 79,
    img: "p5.jpg",
    blurb: "20,000 mAh in a slab that survives being dropped off a bike. Charges a laptop at 65W and tells you the truth about its own battery.",
    specs: [["CAPACITY", "20,000 mAh"], ["OUTPUT", "65W USB-C PD"], ["PORTS", "2× USB-C / 1× USB-A"], ["SHELL", "Shock-rated polymer"]]
  },
  {
    id: "meridian", name: "Meridian One", tag: "WEAR / WATCH", price: 329,
    img: "p6.jpg", badge: "LIMITED",
    blurb: "A quartz watch with a sand dial, a thin steel case, and nothing else. No notifications. It tells the time beautifully and minds its business.",
    specs: [["CASE", "38mm brushed steel"], ["MOVEMENT", "Swiss quartz"], ["GLASS", "Sapphire"], ["STRAP", "Grey leather, quick-release"]]
  },
  {
    id: "drift", name: "Drift Cans", tag: "AUDIO / OVER-EAR", price: 299,
    img: "p7.jpg",
    blurb: "Over-ears with adaptive noise cancelling, 40-hour battery, and memory foam that remembers you. Cream, because black is a decision too.",
    specs: [["DRIVER", "40mm biocellulose"], ["ANC", "Adaptive, -38dB"], ["BATTERY", "40h (ANC on)"], ["WEIGHT", "248g"]]
  },
  {
    id: "arc", name: "Arc Hub", tag: "DESK / CONNECT", price: 89,
    img: "p8.jpg",
    blurb: "Seven ports milled from one piece of aluminum, with a braided cable that doesn't kink. The dongle, finally finished.",
    specs: [["PORTS", "HDMI / 2×C / 2×A / SD / LAN"], ["HDMI", "4K @ 60Hz"], ["PD", "100W pass-through"], ["BODY", "CNC aluminum"]]
  }
];

const FREE_SHIP_AT = 150, SHIP_FLAT = 12;
const fmt = n => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0 });
const $ = s => document.querySelector(s);

/* ── cart state ──────────────────────────── */
let cart = {};
try { cart = JSON.parse(localStorage.getItem("objkt-cart") || "{}"); } catch (e) { cart = {}; }
const saveCart = () => { try { localStorage.setItem("objkt-cart", JSON.stringify(cart)); } catch (e) {} };
const cartCount = () => Object.values(cart).reduce((a, b) => a + b, 0);
const cartSubtotal = () => Object.entries(cart).reduce((sum, [id, q]) => {
  const p = PRODUCTS.find(p => p.id === id); return p ? sum + p.price * q : sum;
}, 0);
const shipCost = () => { const s = cartSubtotal(); return s === 0 || s >= FREE_SHIP_AT ? 0 : SHIP_FLAT; };

/* ── marquee ─────────────────────────────── */
(() => {
  const items = "FREE SHIPPING OVER $150 — <b>2-YEAR WARRANTY</b> — 30-DAY RETURNS — <b>SPARE PARTS FOREVER</b> — DESIGNED ONCE, KEPT ALWAYS — ";
  $("#marqueeTrack").innerHTML = `<span>${items.repeat(3)}</span><span>${items.repeat(3)}</span>`;
})();

/* ── nav ─────────────────────────────────── */
const nav = $("#nav");
addEventListener("scroll", () => nav.classList.toggle("is-scrolled", scrollY > 8), { passive: true });

/* ── product grid ────────────────────────── */
const grid = $("#productGrid");
$("#gridCount").textContent = `${String(PRODUCTS.length).padStart(2, "0")} OBJECTS — ONE OF EACH`;
grid.innerHTML = PRODUCTS.map((p, i) => `
  <article class="card reveal" data-id="${p.id}" style="transition-delay:${(i % 4) * 60}ms" tabindex="0" role="button" aria-label="View ${p.name}">
    ${p.badge ? `<span class="card-badge">${p.badge}</span>` : ""}
    <button class="card-add" type="button" data-add="${p.id}" aria-label="Add ${p.name} to cart">+</button>
    <div class="card-media">
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      <div class="card-quick">QUICK VIEW →</div>
    </div>
    <div class="card-info">
      <div class="card-row">
        <span class="card-name">${p.name}</span>
        <span class="card-price">${fmt(p.price)}</span>
      </div>
      <p class="card-tag">${p.tag}</p>
    </div>
  </article>`).join("");

grid.addEventListener("click", e => {
  const addBtn = e.target.closest("[data-add]");
  if (addBtn) { e.stopPropagation(); addToCart(addBtn.dataset.add, 1); return; }
  const card = e.target.closest(".card");
  if (card) openQuickView(card.dataset.id);
});
grid.addEventListener("keydown", e => {
  if (e.key === "Enter") { const card = e.target.closest(".card"); if (card) openQuickView(card.dataset.id); }
});

/* ── quick view ──────────────────────────── */
const qvOverlay = $("#qvOverlay");
let qvId = null, qvQty = 1;

function openQuickView(id) {
  const p = PRODUCTS.find(p => p.id === id); if (!p) return;
  qvId = id; qvQty = 1;
  $("#qvImg").src = p.img; $("#qvImg").alt = p.name;
  $("#qvTag").textContent = p.tag;
  $("#qvName").textContent = p.name;
  $("#qvPrice").textContent = fmt(p.price);
  $("#qvBlurb").textContent = p.blurb;
  $("#qvQty").textContent = qvQty;
  $("#qvSpecs").innerHTML = p.specs.map(([k, v]) => `<li><b>${k}</b> — ${v}</li>`).join("");
  showOverlay(qvOverlay);
}
$("#qvClose").onclick = () => hideOverlay(qvOverlay);
$("#qvMinus").onclick = () => { qvQty = Math.max(1, qvQty - 1); $("#qvQty").textContent = qvQty; };
$("#qvPlus").onclick = () => { qvQty = Math.min(9, qvQty + 1); $("#qvQty").textContent = qvQty; };
$("#qvAdd").onclick = () => { addToCart(qvId, qvQty); hideOverlay(qvOverlay); };

/* ── overlays ────────────────────────────── */
function showOverlay(el) {
  el.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("open")));
  document.body.style.overflow = "hidden";
}
function hideOverlay(el) {
  el.classList.remove("open");
  setTimeout(() => { el.hidden = true; document.body.style.overflow = ""; }, 320);
}
[qvOverlay, $("#drawerOverlay")].forEach(ov =>
  ov.addEventListener("click", e => { if (e.target === ov) hideOverlay(ov); }));
addEventListener("keydown", e => {
  if (e.key === "Escape") { if (!qvOverlay.hidden) hideOverlay(qvOverlay); if (!$("#drawerOverlay").hidden) hideOverlay($("#drawerOverlay")); }
});

/* ── cart drawer ─────────────────────────── */
const drawerOverlay = $("#drawerOverlay");
$("#cartOpen").onclick = () => { renderCart(); showOverlay(drawerOverlay); };
$("#cartClose").onclick = () => hideOverlay(drawerOverlay);

function addToCart(id, qty) {
  cart[id] = (cart[id] || 0) + qty;
  saveCart(); updateBadge(true);
  const p = PRODUCTS.find(p => p.id === id);
  toast(`ADDED — <b>${p.name.toUpperCase()}</b>`);
  if (!drawerOverlay.hidden) renderCart();
}
function setQty(id, qty) {
  if (qty <= 0) delete cart[id]; else cart[id] = Math.min(9, qty);
  saveCart(); updateBadge(); renderCart();
}
function updateBadge(bump) {
  const el = $("#cartCount");
  el.textContent = cartCount();
  if (bump) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
}

function renderCart() {
  const wrap = $("#cartItems"), foot = $("#cartFoot"), note = $("#shipNote");
  const entries = Object.entries(cart);
  if (!entries.length) {
    wrap.innerHTML = `<div class="cart-empty"><p>Nothing here yet.</p><span class="mono">GOOD OBJECTS WAIT FOR NO ONE.</span></div>`;
    foot.style.display = "none"; note.innerHTML = `FREE SHIPPING OVER <b>${fmt(FREE_SHIP_AT)}</b>`;
    return;
  }
  foot.style.display = "";
  wrap.innerHTML = entries.map(([id, q]) => {
    const p = PRODUCTS.find(p => p.id === id); if (!p) return "";
    return `<div class="cart-item">
      <img src="${p.img}" alt="${p.name}">
      <div>
        <p class="cart-item-name">${p.name}</p>
        <p class="cart-item-price">${fmt(p.price)} EACH</p>
        <div class="qty">
          <button type="button" data-dec="${id}" aria-label="Decrease">−</button>
          <span>${q}</span>
          <button type="button" data-inc="${id}" aria-label="Increase">+</button>
        </div>
      </div>
      <div class="cart-item-right">
        <button class="cart-item-remove" type="button" data-del="${id}" aria-label="Remove ${p.name}">×</button>
        <span class="mono" style="font-weight:700">${fmt(p.price * q)}</span>
      </div>
    </div>`;
  }).join("");
  const sub = cartSubtotal(), ship = shipCost();
  $("#tSub").textContent = fmt(sub);
  $("#tShip").textContent = ship === 0 ? "FREE" : fmt(ship);
  $("#tTotal").textContent = fmt(sub + ship);
  note.innerHTML = sub >= FREE_SHIP_AT
    ? `<b>✓</b> YOUR ORDER SHIPS FREE`
    : `ADD <b>${fmt(FREE_SHIP_AT - sub)}</b> MORE FOR FREE SHIPPING`;
}
$("#cartItems").addEventListener("click", e => {
  const inc = e.target.closest("[data-inc]"), dec = e.target.closest("[data-dec]"), del = e.target.closest("[data-del]");
  if (inc) setQty(inc.dataset.inc, (cart[inc.dataset.inc] || 0) + 1);
  if (dec) setQty(dec.dataset.dec, (cart[dec.dataset.dec] || 0) - 1);
  if (del) setQty(del.dataset.del, 0);
});

/* ── toast ───────────────────────────────── */
let toastTimer;
function toast(html) {
  const t = $("#toast");
  t.innerHTML = html; t.hidden = false;
  requestAnimationFrame(() => t.classList.add("show"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.hidden = true, 400); }, 2200);
}

/* ── hash routing ────────────────────────── */
const views = { "": "view-home", "/": "view-home", "/checkout": "view-checkout", "/confirm": "view-confirm" };
function route() {
  const hash = location.hash.replace(/^#/, "").split("?")[0];
  const target = views[hash] || "view-home";
  ["view-home", "view-checkout", "view-confirm"].forEach(id => { $("#" + id).hidden = id !== target; });
  if (target === "view-checkout") { if (!cartCount()) { location.hash = "#/"; return; } renderCheckoutSummary(); }
  scrollTo(0, 0);
  requestAnimationFrame(observeReveals);
}
addEventListener("hashchange", route);
document.addEventListener("click", e => {
  const link = e.target.closest("[data-route]");
  if (link) { e.preventDefault(); location.hash = link.getAttribute("href"); }
  const scrollLink = e.target.closest("[data-scroll]");
  if (scrollLink) {
    e.preventDefault();
    if (location.hash !== "#/" && location.hash !== "") { location.hash = "#/"; setTimeout(() => {
      document.querySelector(scrollLink.getAttribute("href"))?.scrollIntoView({ behavior: "smooth" });
    }, 80); }
    else document.querySelector(scrollLink.getAttribute("href"))?.scrollIntoView({ behavior: "smooth" });
  }
});
$("#goCheckout").onclick = () => { hideOverlay(drawerOverlay); setTimeout(() => location.hash = "#/checkout", 200); };
$("#checkoutBack").onclick = () => location.hash = "#/";

/* ── checkout ────────────────────────────── */
function renderCheckoutSummary() {
  const box = $("#checkoutSummary");
  const sub = cartSubtotal(), ship = shipCost();
  box.innerHTML = `<h3>Order <em>summary</em></h3>` +
    Object.entries(cart).map(([id, q]) => {
      const p = PRODUCTS.find(p => p.id === id); if (!p) return "";
      return `<div class="cs-item">
        <img src="${p.img}" alt="${p.name}">
        <div><p class="cs-item-name">${p.name}</p><p class="cs-item-qty">QTY ${q}</p></div>
        <span class="cs-item-total">${fmt(p.price * q)}</span>
      </div>`;
    }).join("") +
    `<div class="totals mono cs-totals">
      <div><span>SUBTOTAL</span><span>${fmt(sub)}</span></div>
      <div><span>SHIPPING</span><span>${ship === 0 ? "FREE" : fmt(ship)}</span></div>
      <div class="totals-grand"><span>TOTAL</span><span>${fmt(sub + ship)}</span></div>
    </div>`;
  $("#payTotal").textContent = fmt(sub + ship);
}

/* input formatting */
const cardInput = document.querySelector('[name="card"]');
cardInput.addEventListener("input", () => {
  cardInput.value = cardInput.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
});
const expInput = document.querySelector('[name="expiry"]');
expInput.addEventListener("input", () => {
  let v = expInput.value.replace(/\D/g, "").slice(0, 4);
  expInput.value = v.length > 2 ? v.slice(0, 2) + "/" + v.slice(2) : v;
});
document.querySelector('[name="cvc"]').addEventListener("input", e => {
  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4);
});

$("#checkoutForm").addEventListener("submit", e => {
  e.preventDefault();
  const form = e.target, err = $("#checkoutError");
  let bad = null;
  form.querySelectorAll("[required]").forEach(el => {
    el.classList.remove("invalid");
    const v = el.value.trim();
    const ok = v && (el.name !== "email" || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v))
      && (el.name !== "card" || v.replace(/\s/g, "").length === 16)
      && (el.name !== "expiry" || /^(0[1-9]|1[0-2])\/\d{2}$/.test(v))
      && (el.name !== "cvc" || v.length >= 3);
    if (!ok) { el.classList.add("invalid"); bad = bad || el; }
  });
  if (bad) {
    err.hidden = false;
    err.textContent = "CHECK THE HIGHLIGHTED FIELDS — SOMETHING IS MISSING OR OFF.";
    bad.focus(); return;
  }
  err.hidden = true;
  const btn = $("#placeOrder");
  btn.disabled = true; btn.textContent = "Processing…";
  setTimeout(() => {
    const order = "OBJKT-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    $("#orderNum").textContent = "ORDER " + order;
    cart = {}; saveCart(); updateBadge();
    btn.disabled = false; btn.innerHTML = 'Place order — <span id="payTotal"></span>';
    form.reset();
    location.hash = "#/confirm";
  }, 1400);
});

/* ── newsletter ──────────────────────────── */
$("#newsletterForm").addEventListener("submit", e => {
  e.preventDefault();
  const input = $("#newsletterEmail"), note = $("#newsletterNote");
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value.trim())) {
    note.textContent = "✓ YOU'RE ON THE LIST. ONE EMAIL A MONTH, PROMISED.";
    note.classList.add("ok"); input.value = "";
  } else {
    note.textContent = "THAT EMAIL DOESN'T LOOK RIGHT — TRY AGAIN?";
    note.classList.remove("ok"); input.focus();
  }
});

/* ── reveal on scroll ────────────────────── */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
}, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
function observeReveals() { document.querySelectorAll(".reveal:not(.in)").forEach(el => io.observe(el)); }

/* ── boot ────────────────────────────────── */
updateBadge(); route(); observeReveals();
