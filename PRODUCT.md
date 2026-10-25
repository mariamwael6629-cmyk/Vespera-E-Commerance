# Product

<!-- impeccable:product-schema 1 -->

> Inferred from the README, `frontend/index.html` and `backend/app/seed.py`. The owner asked the redesign to proceed on inferred context; treat each line as an assumption until confirmed.

## Platform

web

## Users
People buying small, well-made technology objects (headphones, speakers, leather sleeves, desk stands, watch bands) who care about materials and longevity. They compare finishes and read reviews before buying. Admins manage products, orders, users and promo codes.

## Product Purpose
Vespera is a storefront SPA: landing, catalogue with categories and live search, product detail with material/finish choice and reviews, cart and checkout with promo codes, wishlist (guest storage synced on login), auth, account, and an admin dashboard. Light and dark themes.

## Positioning
"Considered Objects": small technology machined from real materials (walnut, leather, aluminium), finished by hand, repaired rather than replaced.

## Capabilities and Constraints
- Single `frontend/index.html` with inline `<style>` and `<script>`; views are template strings with many inline styles that reference CSS variables. Lucide icons from a CDN. FastAPI + SQLite backend.
- Theme via `data-theme` (`dark` default variables, `light` overrides).

## Brand Commitments
- Name "VESPERA" and tagline "Considered Objects".

## Evidence on Hand
- Twelve seeded products in four categories (Audio, Carry, Desk, Wearables), material swatches, four seeded reviews. Hero stats (12k+ objects shipped, 4.8/5, 7 yrs average product life) are demo copy; do not extend.

## Product Principles
1. Material first: finishes and textures carry the brand.
2. Show the object large; let specs answer questions.
3. Calm commerce: no urgency tricks.
