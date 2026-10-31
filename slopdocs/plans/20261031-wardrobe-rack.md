# Wardrobe rack prototype

Build a static, private frontend for the proposed outfit assistant. The current request is the rack interaction, not AI recommendations or personal clothing uploads.

- Use sample garments drawn as inline SVG so the prototype works without external image hosts or user photos. Replace the SVG source with uploaded garment cutouts when the wardrobe backend exists.
- Keep each garment in a stable rack slot. Clicking or focusing it selects the piece; CSS perspective rotates the garment from an angled side view to a forward-facing view. Stable slots avoid a carousel jump during the flip.
- Show selected item details and make “Add to look” work in browser memory as a small frontend demonstration. Do not pretend it persists or calls AI.
- Support arrow-key navigation, touch scrolling, focus styles, and reduced motion.
- Verify desktop and phone layouts in a browser before publishing the private Site.
