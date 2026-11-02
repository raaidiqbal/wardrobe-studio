# Wardrobe rack

Decision: this is a digital wardrobe frontend with two user-supplied pieces, not a store. Do not add prices, retailer links, or shopping calls to action. The current outfit selection is browser-local and resets on reload; AI recommendations, uploads, accounts, and persistence are future work.

## Structure

- `dist/index.html`: page shell, two-piece rack, selected-piece summary, today's look panel, and detail dialog.
- `dist/styles.css`: chrome rail, close-packed side-on garments, canvas blend, slot expansion, detail dialog, responsive and reduced-motion styles.
- `dist/app.js`: piece records, canvas turn players, hover and keyboard selection, detail navigation, and temporary outfit state.
- `dist/frames/navy-fuzzy-knit/`: 62 WebP frames from the supplied navy Mutimer Kling clip.
- `dist/frames/cream-polo-sweater/`: 57 mirrored WebP frames from the supplied cream Polo Ralph Lauren Kling clip.
- `scripts/process_turn.py`: motion-aware frame extraction with `--settle-tolerance` and optional `--mirror`; uses `numpy` and `imageio-ffmpeg`.

## Interaction and media decisions

The user supplied a reel of a tightly packed clothing rail. The first prototype spaced mostly front-facing garments like an editorial hero; a later version used six generated concept samples. Both missed the user's wardrobe goal. The rack now uses only the two owned pieces. Each starts side-on and turns in place on hover or selection, widening its slot so the other garment makes room. Clicking opens its front cutout in a dialog with a counter, description, arrows, Escape close, and a today's-look action.

Each clip was analyzed separately instead of cut at a fixed time. The navy clip uses source frames 0–61. The cream clip uses 0–56 with a stricter `.01` settle tolerance; its motion direction was opposite the navy, so its exported frames are horizontally mirrored. The player draws 480px WebPs on a canvas over about 1.1 seconds, forwards and backwards, and keeps drawing until the target frame loads. The last six frames blend into the original unmirrored front photo, restoring correct lettering and labels. The canvas uses `mix-blend-mode:multiply` to remove white. Its ancestors avoid z-index, transform, opacity, filter, and perspective; the load-in animation runs on the canvas itself. Both clips include their own hanger, so no SVG hanger overlays them. Reduced motion jumps to the endpoints.

The navy source clip has a vertical camera/garment drift: the hook starts at image row 0 but moves to row 9–12 during the first few turn frames, then stays around row 9. The separate true-front photo also places the hook at row 9 after resizing to the 480px canvas. This made the navy sweater dip early in the turn and again when the final photo fully replaced the last frame. For the navy piece only, the player samples the dark hook in the top center of each loaded frame and the true-front photo, and draws each shifted up by its own measured offset. It fills the canvas white first to preserve the white source matte at the bottom. Keep this registration if the navy frames are re-exported; remove it only if the new source itself holds a fixed hook position.

The detail view uses transparent cutouts based on the supplied front photos. The cream cutout uses a white image surround to hide minor light edge fringe. Desktop rack arrow navigation must not let programmatic scrolling reselect the nearest garment; mobile scroll selection still chooses the garment nearest the viewport center after a manual swipe.

## Verification

Check desktop and phone layouts, two side-on resting poses, same-direction turns, reverse on leave, arrow selection, detail previous/next and Escape, today's-look state, no retail links, reduced-motion endpoint changes, and no horizontal document overflow. Deliver `index.html`, `styles.css`, `app.js`, `assets/`, and `frames/` together.
