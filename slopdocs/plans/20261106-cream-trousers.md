# Add cream pleated trousers

Decision: add the user-supplied cream pleated trousers as the fourth owned wardrobe piece. No brand was supplied, so use a descriptive name without inventing one. Keep the private Site and GitHub repository, and preserve the no-shopping digital wardrobe scope.

- Compare the turn clip against the existing jacket sequence. Both hangers swing in the same direction from side to front, so export the useful range without mirroring.
- Detect motion start and settled front, export 480px WebP frames, and blend the final frames into the unmirrored supplied front photo only if the alignment is clean. Preserve the original front and side photos.
- Prepare a transparent front cutout for the in-focus panel and detail dialog. The cream fabric on a white background makes automatic extraction delicate; inspect the result for lost hems and pleats.
- Add the trousers to the rack with category `bottoms`; ensure the clip's hanger remains on the chrome rail and the long legs fit the 260px canvas. Check desktop/mobile, turn reversal, detail navigation, and reduced motion.
- Publish the existing owner-private Site and push the same source to `raaidiqbal/wardrobe-studio`.

Observed: the clip has 73 frames at 24 fps; motion analysis selects 5–66 and exports 62 frames. The hanger swings in the same direction as the existing jacket. Its dark hook begins at source row 29–32, so shifting the drawn frame up 30px keeps it at the rail without introducing a visible vertical jump. The supplied still has a slightly different pose from the last video frame; holding the video endpoint avoids a final-frame flip. The front cutout is used only against the light detail and focus surfaces.
