# Theme update (UI only)

Content, routes, API calls and data handling are unchanged.

- Tokens: `tailwind.config.js` (brand `#2fbcba` + tints, accents iris/coral/sun/azure, ink darks, soft/muted text)
- Global styles and reusable classes (`.surface-card`, `.btn-primary`, `.btn-ghost`, `.field`, `.eyebrow`, `.band`): `src/index.css`
- Rotating accent colours for cards/stats/steps: `src/lib/accents.ts`
- Background: your original video background is kept as-is (no added background). Only the cards, buttons, text, borders and accent colours were themed.
- Font: Plus Jakarta Sans (`index.html`)
- Not touched: admin panel, `pages/h.tsx` (unused)
