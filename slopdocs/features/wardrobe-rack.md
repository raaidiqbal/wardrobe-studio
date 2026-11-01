# Wardrobe rack

Decision: this is a static frontend concept for the outfit-assistant project, with sample garments only. No AI, accounts, uploads, or persistence are implied by the current UI.

## Structure

- `dist/index.html`: page shell, rack controls, selected-piece summary, today's look panel, and detail dialog.
- `dist/styles.css`: rack layout, canvas blend with the dotted background, static fallback perspective, load-in/sway, dialog, responsive and reduced-motion rules.
- `dist/app.js`: one video-turn product and six concept samples; frame player; filter, hover, selection, detail, and in-memory look state.
- `scripts/process_turn.py`: motion-aware clip analysis and frame export, dependent on `numpy` and `imageio-ffmpeg`.
- `dist/frames/navy-fuzzy-knit/`: 62 WebP frames at 480px, plus manifest. Source is the user-supplied 3.04 s, 24 fps Kling MP4, kept outside the deployed static directory.

## Interaction decision

The user supplied a short reel showing a tightly packed clothing rail: most garments face nearly sideways, while a hovered piece opens toward the viewer in its original rail position. The first prototype had widely spaced, mostly front-facing clothes and a large editorial hero, which missed that interaction. The rack now uses 84px resting slots that expand to 210px for the selected piece. Neighboring slots slide aside with the flex-basis transition. The white dotted rack and slim metal rail place the clothes in the center of the page, and the oversized hero is hidden. Selection updates the detail panel. Desktop mouse hover, click, and arrow keys browse the pieces; mobile supports taps and horizontal scrolling. Browsing briefly animates a damped `rotateZ` sway on visible assemblies; reduced-motion users get no sway. The rail itself stays fixed. Vertical mouse-wheel input remains normal page scrolling, so the rack does not trap it.

The prior resting pose used `rotateY(±74deg)` on a front photo, which flattened the garment into a plane and left no fabric depth. Six concept samples now use generated side images and a shallow `rotateY(±30deg)` with a front blend. They are still approximate 3/4 views, not true rotating cloth. The navy Mutimer knit instead uses the supplied side/front hanger photos and a Kling turn clip. Frame analysis found motion begins at frame 0 and the front is settled by frame 61, rather than using a fixed time cut. The clip already turns in the correct direction and its embroidery reads correctly. Playback draws WebPs on a 480px canvas in about 1.1 seconds, forwards on hover and backwards on leave; direction can change mid-turn. The final six frames fade into the supplied unmirrored front photo. Missing target frames keep the previous drawing until loaded. The canvas uses `mix-blend-mode:multiply` to lose the white background. All canvas ancestors avoid z-index, transform, opacity, filter, and perspective; entrance animation runs on the canvas. The video includes its own black hanger, so the old SVG hanger is omitted for that piece. Reduced motion jumps between endpoints.

The knit's detail view uses a transparent cutout generated from the supplied front photo, retaining the black hanger. The six other garments are generated photorealistic concept samples, not claims of exact ownership. Only the knit has a price and official Mutimer availability link; the listed A$260 is a snapshot of the Australian product page, not live pricing. Clicking any piece opens a dialog with front image, counter, description, price or concept-sample label, and previous/next controls. Escape and the close button dismiss it. The current "Add to today's look" set resets on reload; it only demonstrates the frontend interaction. Later, records can point to user-owned photos and turn clips.

## Verification

Use a desktop viewport and a 390px phone viewport. Check all side poses, the knit's forward and reverse canvas frames, fast direction changes, neighbor spacing, hanger alignment, click-to-open dialog, prev/next/arrow/Escape, filter and look actions, mobile initial centering and horizontal scroll, no document overflow, and reduced-motion endpoint changes. Static delivery needs `index.html`, `styles.css`, `app.js`, `assets/`, and `frames/` together.
