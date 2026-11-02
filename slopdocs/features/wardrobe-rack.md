# Wardrobe rack

Decision: this is a static frontend concept for the outfit-assistant project. The current rack shows only the supplied navy Mutimer knit. No AI, accounts, uploads, or persistence are implied by the current UI.

## Structure

- `dist/index.html`: page shell, rack controls, selected-piece summary, today's look panel, and detail dialog.
- `dist/styles.css`: rack layout, canvas blend with the dotted background, static fallback perspective, load-in/sway, dialog, responsive and reduced-motion rules.
- `dist/app.js`: one video-turn product; frame player; hover, selection, detail, and in-memory look state. The older generic sample handling remains for later additions, but the six concept sample records were removed from `pieces`.
- `scripts/process_turn.py`: motion-aware clip analysis and frame export, dependent on `numpy` and `imageio-ffmpeg`.
- `dist/frames/navy-fuzzy-knit/`: 62 WebP frames at 480px, plus manifest. Source is the user-supplied 3.04 s, 24 fps Kling MP4, kept outside the deployed static directory.

## Interaction decision

The user supplied a short reel showing a tightly packed clothing rail: most garments face nearly sideways, while a hovered piece opens toward the viewer in its original rail position. The first prototype had widely spaced, mostly front-facing clothes and a large editorial hero, which missed that interaction. A later prototype had six generated concept samples plus the navy knit. The user then asked to remove every other garment and keep the knit exactly as it is. The current rack shows one side-on knit, centered on the same white dotted rack and chrome rail. Hover turns it forward and pointer leave reverses it; click opens the detail panel. Single-item filters and previous/next controls are hidden. The temporary look selection remains.

The navy Mutimer knit uses the supplied side/front hanger photos and a Kling turn clip. Frame analysis found motion begins at frame 0 and the front is settled by frame 61, rather than using a fixed time cut. The clip already turns in the correct direction and its embroidery reads correctly. Playback draws WebPs on a 480px canvas in about 1.1 seconds, forwards on hover and backwards on leave; direction can change mid-turn. The final six frames fade into the supplied unmirrored front photo. Missing target frames keep the previous drawing until loaded. The canvas uses `mix-blend-mode:multiply` to lose the white background. All canvas ancestors avoid z-index, transform, opacity, filter, and perspective; entrance animation runs on the canvas. The video includes its own black hanger, so the old SVG hanger is omitted for that piece. Reduced motion jumps between endpoints.

The knit's detail view uses a transparent cutout generated from the supplied front photo, retaining the black hanger. Its listed A$260 is a snapshot of the Australian product page, not live pricing. Clicking the piece opens a dialog with front image, counter, description, price, and official Mutimer availability link. Escape and the close button dismiss it. The current "Add to today's look" set resets on reload; it only demonstrates the frontend interaction. Later, records can point to user-owned photos and turn clips.

## Verification

Use a desktop viewport and a 390px phone viewport. Check that only one garment appears, the count is 01 / 01, the knit's forward and reverse canvas frames work, hanger alignment, click-to-open dialog, Escape, look action, mobile centering, no document overflow, and reduced-motion endpoint changes. Static delivery needs `index.html`, `styles.css`, `app.js`, `assets/`, and `frames/` together.
