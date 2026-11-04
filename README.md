# Wardrobe Studio

An interactive digital wardrobe with three owned pieces: a navy Mutimer Shaggy Mohair Knit, a cream Polo Ralph Lauren cashmere sweater, and Khushposh Leather Jacket #19 in full-grain sheep leather. All three rest side-on on a chrome rail, turn toward the viewer on hover or selection, and open a larger detail view on click. The garment in focus fills the lower half of the rack page. "Today's look" is a separate placeholder page for a future outfit generation feature. There are no retail prices or shopping links.

Run locally with a static server from `dist/`, for example `python -m http.server 4174 --directory dist`.

This is a frontend concept. It does not yet have an AI service, outfit generation, garment upload, accounts, or a saved wardrobe. The current [hosted site](https://wardrobe-studio-raaid.iqbalm490714.chatgpt.site/) is private.

To process another square side-to-front clip, install `numpy` and `imageio-ffmpeg`, then run `python scripts/process_turn.py <video.mp4> dist/frames/<piece-id>`. The script detects motion onset and a settled front pose, exports 480px WebP frames, and writes a manifest. Compare its turn direction with the existing pieces; add `--mirror` when it turns the other way. For pale garments whose final motion is subtle, adjust `--settle-tolerance` after inspecting the chosen endpoint. Keep an original, unmirrored front image for the final six-frame blend so logos and labels read correctly. Add the new frame count and assets to `dist/app.js`.
