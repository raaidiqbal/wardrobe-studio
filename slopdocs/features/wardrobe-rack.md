# Wardrobe rack

Decision: this is a static frontend concept for the outfit-assistant project, with sample garments only. No AI, accounts, uploads, or persistence are implied by the current UI.

## Structure

- `dist/index.html`: editorial page shell, rack controls, selected-piece details, and today's look panel.
- `dist/styles.css`: warm gallery styling, responsive rack, joint hanger and garment perspective rotation, damped sway animation, focus states, reduced-motion override.
- `dist/app.js`: seven sample clothing records, local photo assets, filter/selection state, arrow-key navigation, scroll-triggered sway, and an in-memory look set.

## Interaction decision

Each garment keeps a stable rack slot. The hanger and garment now rotate together around the hook: unselected assemblies use `rotateY(±54deg)`, and the selected assembly faces forward and moves closer. This makes the clothing appear suspended rather than rotating below a fixed hanger. Selection updates the detail panel and horizontally centers the item on phones. Browsing or horizontal scrolling briefly animates a damped `rotateZ` sway on visible assemblies; reduced-motion users get no sway. The rail itself stays fixed.

Six garments use generated photorealistic product cutouts with transparent backgrounds, bundled in `dist/assets/`. The navy fuzzy knit uses a transparent cutout of the user's product image at `dist/assets/navy-fuzzy-knit-cutout.png`, retaining its fabric and embroidery. The images are prototype samples, not a claim of owning those exact six items. The trouser uses a bar hanger and the tops use wooden shoulder hangers. Later, garment records can refer to user-owned photos. The current "Add to today's look" set resets on reload; it only demonstrates the frontend interaction.

## Verification

Use a desktop viewport and a 390px phone viewport. Check that garments meet their hanger shoulders, selected and side-facing items, click and arrow-key selection, filter and look actions, horizontal scrolling with sway, reduced motion, and no body overflow. Static delivery needs `index.html`, `styles.css`, `app.js`, and all `assets/` files together.
