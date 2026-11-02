# Add the cream Polo sweater

Decision: add the supplied cream Polo Ralph Lauren sweater as a second owned wardrobe item, using its supplied side/front photos and Kling turn clip. Preserve the navy Mutimer knit. Do not add retail prices or shopping links: the user explicitly clarified that the app is a digital wardrobe, despite the generic pasted landing-page prompt.

- Analyze the second 3.04 s clip separately for motion onset and final settled pose. Export the useful range as 480px WebP frames in `dist/frames/cream-polo-sweater/`, check turn direction against the navy clip, and use the true supplied front at the end so the label remains correct.
- Create a transparent front cutout for the detail view. Keep the black hanger embedded in the clip and photos; the canvas must not add the site's SVG hanger.
- Restore two-item rack browsing and the detail view's previous/next controls. Keep both garments side-on at rest; hover opens only the targeted garment and widens its slot. Name and garment details replace price and availability UI. The today's-look selection remains browser-local.
- Check desktop and phone layout, frame loading, hover and reverse turn, click/detail navigation, and reduced motion; publish to the existing owner-private Site.
