# Design — Vespera

**World: the spec sheet.** Vespera sells small technology machined from real materials, so the store reads like an engineering drawing set. Light mode (the default) is drafting paper; dark mode is a blueprint. Product facts are drawn as callouts with leader lines pointing at the object, and a single markup-orange colour carries every action. The soft green-black theme, Cormorant italics, glass panels, gradient fields and tracked uppercase labels are gone.

## Tokens (`frontend/index.html` `<style>` `:root` / `[data-theme="light"]`)

Variable names are historical: `--ink` is the ground and `--ivory` is the text.

| Token | Light (drafting) | Dark (blueprint) | Role |
|---|---|---|---|
| `--ink` / `--ink-soft` | `#F3F4F1` / `#EAECE8` | `#0E2133` / `#12293F` | ground |
| `--surface` / `--surface-soft` | `#FFFFFF` / `#E6E9E4` | `#152E47` / `#1C3956` | cards, image wells |
| `--ivory` / `--ivory-dim` / `--beige` | `#111315` / `#2E3236` / `#5B6065` | `#EAF0F6` / `#C6D2DE` / `#93A7BA` | text levels |
| `--copper` / `--copper-bright` | `#D23F1E` / `#BF3819` | `#FF7A59` / `#FF8F72` | markup orange: primary action, callout dots, stars, eyebrow dot |
| `--line` / `--line-strong` | 12% / 24% ink | 13% / 24% | rules and borders |
| `--on-accent` | `#FFFFFF` | `#0E2133` | text on orange |

Material swatches are flat colours (walnut `#5E3E28`, obsidian `#25211E`, bone ivory `#E9E1D2`, burgundy `#6A1F2A`, copper `#B97C4E`, slate `#4D4944`).

### Type
One family: **Chivo** (400–900). Headings are 800 with tracking −0.02 to −0.04em; the hero runs `clamp(44px, 6.4vw, 92px)`. Body is 16px. Labels are sentence case at 13–15px. `.mono` now means tabular figures in Chivo, not a monospace face.

### Shape
Radii 2 / 3 / 4px: machined edges. Buttons are 48px tall (54px large).

## Components
- **Hero figure:** the Aria II photo in a plate. Four spec callouts (driver, battery, weight, connectivity) come from the product's own `specs` and are joined to the object by orange leader lines and dots. A caption rule below shows finish, price and rating.
- **Spec strip:** one ruled line of shipping and repair facts.
- **Eyebrows:** kept as section labels (owner's decision), set as an orange dot plus sentence-case text.
- **Buttons:** primary is orange and inverts to ink on hover; ghost is a 1px rule that turns ink on hover.
- **Member band:** a solid ink panel in light mode, a raised blueprint panel in dark.
- **Badges:** light mode gets its own readable tints for success, sale and new.

## Motion
- The hero copy rises in sequence, and the spec callouts arrive 80ms apart.
- Page views fade up 14px. Reduced motion removes the travel.
- Lucide is pinned to 0.460.0 (it was `@latest`).
