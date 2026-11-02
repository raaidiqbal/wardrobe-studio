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

Each clip was analyzed separately instead of cut at a fixed time. The navy clip uses source frames 0–61. The cream clip uses 0–56 with a stricter `.01` settle tolerance; its motion direction was opposite the navy, so its exported frames are horizontally mirrored. The player draws 480px WebPs on a canvas over about 1.1 seconds, forwards and backwards, and keeps drawing until the target frame loads. Blending the entire cream frame into the original unmirrored front photo made the whole sweater visibly flip at the endpoint. The cream clip now holds its mirrored final frame and blends only the tiny neck-label rectangle from the true front over its last six frames. This restores readable lettering without changing the garment silhouette or hook direction. The navy clip already has readable lettering, so it holds on its final video frame without any still-image blend. The canvas uses `mix-blend-mode:multiply` to remove white. Its ancestors avoid z-index, transform, opacity, filter, and perspective; the load-in animation runs on the canvas itself. Both clips include their own hanger, so no SVG hanger overlays them. Reduced motion jumps to the endpoints.

The navy source clip has a vertical camera/garment drift. In the user's screen recording, the metal hook stays near the rail while the black plastic hanger and sweater drop below it as the garment opens. The hook starts at image row 0 but moves to row 9–12, while the plastic hanger top moves from row 40 to row 54. The cream hanger top moves only about 5px. For the navy piece only, the player samples the dark plastic hanger top (first row with at least eight dark pixels across the center strip) and draws the sweater frame shifted to keep that top at row 40. It then restores a narrow strip of the original chrome hook independently, aligned to row 0. The two regions overlap at the neck so the hook stays connected to the hanger. It fills the canvas white first to preserve the white source matte. Keep this registration if the navy frames are re-exported; remove it only if the new source itself holds a fixed hanger position.

An attempted 10px lift of the entire navy canvas made the resting sweater visibly too high relative to the cream sweater. The navy canvas is back at the shared row 38 position. The navy clip holds on its final video frame rather than replacing it with a separately framed still. The HTML includes an asset version query to force revalidation of the corrected player code after deployment.

The detail view uses transparent cutouts based on the supplied front photos. The cream cutout uses a white image surround to hide minor light edge fringe. Desktop rack arrow navigation must not let programmatic scrolling reselect the nearest garment; mobile scroll selection still chooses the garment nearest the viewport center after a manual swipe.

## Verification

Check desktop and phone layouts, two side-on resting poses, same-direction turns, reverse on leave, arrow selection, detail previous/next and Escape, today's-look state, no retail links, reduced-motion endpoint changes, and no horizontal document overflow. Deliver `index.html`, `styles.css`, `app.js`, `assets/`, and `frames/` together.
