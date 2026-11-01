# Wardrobe Studio

Interactive clothing-rack frontend concept for an outfit assistant. One Mutimer Shaggy Mohair Knit uses a frame sequence from the supplied Kling clip; six generated concept samples use paired side/front cutouts. Garments rest side-on. Hovering opens a piece in its slot and leaving reverses the turn. Clicking opens a detail view with keyboard navigation. Filters, mobile horizontal scrolling, and a temporary "today's look" selection work in the browser.

Run locally with a static server from `dist/`, for example `python -m http.server 4174 --directory dist`.

The prototype has no AI service, clothing upload, account, or saved wardrobe. Only the navy knit has a real turn sequence; the other pieces are marked as concept samples and have no invented price or availability link. The knit's A$260 retail price and availability link reflect Mutimer's Australian listing at build time and may change.

To process another square side-to-front clip, install `numpy` and `imageio-ffmpeg`, then run `python scripts/process_turn.py <video.mp4> dist/frames/<piece-id>`. The script detects motion onset and a pose close to the final frame, exports 480px WebPs, and writes a manifest. Inspect the chosen bounds and endpoint frames for each new clip before adding its `turnFrames` count to `dist/app.js`.
