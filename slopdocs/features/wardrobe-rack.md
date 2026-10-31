# Wardrobe rack

Decision: this is a static frontend concept for the outfit-assistant project, with sample garments only. No AI, accounts, uploads, or persistence are implied by the current UI.

## Structure

- `dist/index.html`: editorial page shell, rack controls, selected-piece details, and today's look panel.
- `dist/styles.css`: warm gallery styling, responsive rack, CSS perspective rotation, focus states, reduced-motion override.
- `dist/app.js`: six sample clothing records, inline SVG product illustrations, filter/selection state, arrow-key navigation, and an in-memory look set.

## Interaction decision

Each garment keeps a stable rack slot. Unselected garments use `rotateY(±64deg)` and the selected garment rotates to `0deg` and scales forward. Selection updates the detail panel and horizontally centers the item on phones. This avoids a reordering jump when clicking a piece. Hangers and rail remain fixed while the garment illustration rotates.

The garments are hand-coded SVG vectors so the preview has no external image dependency. Later, replace `garmentSvg()` with real cutout photos linked to user-owned clothing records. The current "Add to today's look" set resets on reload; it only demonstrates the frontend interaction.

## Verification

Use a desktop viewport and a 390px phone viewport. Check the selected garment, click and arrow-key selection, filters, look count and clear action, horizontal scrolling, and no body overflow. Static delivery needs `index.html`, `styles.css`, and `app.js` together.
