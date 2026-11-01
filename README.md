# Wardrobe Studio

Interactive clothing-rack frontend concept for an outfit assistant. The rack uses six photorealistic generated garment cutouts and a cutout of the user's navy sweater photo. Each sample has a separate side-view image so the resting garments retain fabric volume and hang naturally on the rail. Hovering, clicking, or using the arrows brings a piece forward in place, widens its slot, and briefly sways its hanger. Filters, keyboard navigation, mobile horizontal scrolling, and a temporary "today's look" selection work in the browser.

Run locally with a static server from `dist/`, for example `python -m http.server 4174 --directory dist`.

The prototype has no AI service, clothing upload, account, saved wardrobe, or per-garment turn video yet. The side-to-front change uses CSS rotation and a short image blend; a filmed or generated turn sequence would be needed for realistic cloth movement through the turn.
