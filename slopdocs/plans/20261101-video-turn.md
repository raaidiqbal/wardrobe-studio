# Video turn for the rack

Decision: add the supplied navy Mutimer knit as the first frame-sequence garment. Keep the six concept samples with their current front/side image fallback until matching turn clips exist. Do not imply that sample garments have retail prices or availability.

- Analyze the 3.04 s, 24 fps, 940 px square Kling clip for first meaningful motion and final stable pose using frame differences, then inspect the chosen bounds. Export a 480 px WebP sequence and metadata. Use the supplied square hanger images as the static side and detail front, which match this clip better than the earlier generated cutouts.
- In the rack, rest the knit side-on. Pointer hover plays the sequence forward; pointer leave plays backward. Keep current progress when direction reverses. Drive a canvas with requestAnimationFrame and retain the last drawn frame while the target image loads. Reduce motion to instant endpoint changes. Other garments keep the static image transition. Widen the active slot, and leave click for the detail overlay.
- The clip has a near-white background. Prefer preprocessing it to transparent edges if multiply cannot blend cleanly through the existing layered rack structure. Do not create a visible white rectangle or duplicate hanger.
- Detail overlay: large original front image, name, description, price for the real Mutimer item, link to its official availability page, previous/next, counter, Escape/Close. Mark sample pieces explicitly; do not invent prices or buy links.
- Verify forward/reverse playback, fast reversal, focus/keyboard, reduced motion, mobile overflow, all image requests, then publish to the existing private Site.
