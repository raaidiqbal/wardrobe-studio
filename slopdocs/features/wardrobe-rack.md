# Wardrobe rack

Decision: this is a static frontend concept for the outfit-assistant project, with sample garments only. No AI, accounts, uploads, or persistence are implied by the current UI.

## Structure

- `dist/index.html`: editorial page shell, rack controls, selected-piece details, and today's look panel.
- `dist/styles.css`: warm gallery styling, responsive rack, shallow joint perspective rotation, front/side image blend, damped sway animation, focus states, reduced-motion override.
- `dist/app.js`: seven sample clothing records, paired front and side assets, filter/selection state, arrow-key navigation, scroll-triggered sway, and an in-memory look set.

## Interaction decision

The user supplied a short reel showing a tightly packed clothing rail: most garments face nearly sideways, while a hovered piece opens toward the viewer in its original rail position. The first prototype had widely spaced, mostly front-facing clothes and a large editorial hero, which missed that interaction. The rack now uses 84px resting slots that expand to 210px for the selected piece. Neighboring slots slide aside with the flex-basis transition. The white dotted rack and slim metal rail place the clothes in the center of the page, and the oversized hero is hidden. Selection updates the detail panel. Desktop mouse hover, click, and arrow keys browse the pieces; mobile supports taps and horizontal scrolling. Browsing briefly animates a damped `rotateZ` sway on visible assemblies; reduced-motion users get no sway. The rail itself stays fixed. Vertical mouse-wheel input remains normal page scrolling, so the rack does not trap it.

The prior resting pose used `rotateY(±74deg)` on a front photo, which flattened the garment into a plane and left no fabric depth. Each record now renders a front image and a separate transparent side-view image (`dist/assets/<id>-side.png`). The side photo remains visible in a shallow `rotateY(±30deg)` pose, while selection fades to the original front photo as the hanger opens. This improves thickness and drape without claiming a true cloth simulation. The side images were generated from the corresponding front assets; they depict approximate 3/4 views, so fine print and seams should be checked against the originals. A real side-to-front video or frame sequence per garment would be needed to reproduce the reel's continuous fabric motion. The user shared a guide describing start/end-frame video generation and canvas playback; the current prototype has no turn clips and does not imply that pipeline is implemented.

Six garments use generated photorealistic product cutouts with transparent backgrounds, bundled in `dist/assets/`. The navy fuzzy knit uses a transparent cutout of the user's product image at `dist/assets/navy-fuzzy-knit-cutout.png`, retaining its fabric and embroidery. The images are prototype samples, not a claim of owning those exact six items. The trouser uses a bar hanger and the tops use wooden shoulder hangers. Later, garment records can refer to user-owned photos. The current "Add to today's look" set resets on reload; it only demonstrates the frontend interaction.

## Verification

Use a desktop viewport and a 390px phone viewport. Check that the resting row appears compressed, the chosen garment opens without moving to the center, neighbors shift along the rail, the hanger stays attached, click/hover/arrow/wheel selection updates the detail, filters and look actions work, horizontal scrolling on phones does not overflow the page, and reduced motion removes animation. Static delivery needs `index.html`, `styles.css`, `app.js`, and all `assets/` files together.
