# OBJKT® — Objects, Engineered.

A fictional D2C tech-objects store, built as a front-end design demo.

**Live:** https://noouh1.github.io/objkt-store/

## What's inside

- `index.html` — single-page structure: hero, product grid, manifesto, FAQ, newsletter, checkout, order confirmation
- `styles.css` — the whole design system: bone paper, ink, safety orange; Space Grotesk + Instrument Serif + JetBrains Mono
- `app.js` — catalog data, cart state (localStorage), quick-view modal, cart drawer, hash routing (`#/`, `#/checkout`, `#/confirm`), mock checkout with input validation and formatting
- `p1–p8.jpg`, `hero.jpg` — AI-generated product photography, one consistent studio style

## Features

- Working cart: add/remove, quantities, free-shipping threshold logic, totals, persisted in `localStorage`
- Quick view modal and slide-over cart drawer
- Mock checkout: card number / expiry formatting, inline validation, fake processing state, order confirmation
- Reveal-on-scroll animations, marquee, hover micro-interactions
- Mobile-first responsive (2-col grid on phones, full-width drawer, sticky summary on desktop)
- Zero dependencies, zero build step. Open `index.html` and it runs.

*Demo only — no real payment is processed and nothing ships.*
