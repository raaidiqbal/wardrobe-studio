# Wardrobe Studio

Interactive clothing-rack frontend concept for an outfit assistant. The rack currently shows one Mutimer Shaggy Mohair Knit with a frame sequence from the supplied Kling clip. It rests side-on, turns toward the viewer on hover, and turns back on pointer leave. Clicking opens its detail view. The temporary "today's look" selection works in the browser.

Run locally with a static server from `dist/`, for example `python -m http.server 4174 --directory dist`.

The prototype has no AI service, clothing upload, account, or saved wardrobe. The knit's A$260 retail price and availability link reflect Mutimer's Australian listing at build time and may change. Other concept garments remain in source history but are absent from the current rack.

To process another square side-to-front clip, install `numpy` and `imageio-ffmpeg`, then run `python scripts/process_turn.py <video.mp4> dist/frames/<piece-id>`. The script detects motion onset and a pose close to the final frame, exports 480px WebPs, and writes a manifest. Inspect the chosen bounds and endpoint frames for each new clip before adding its `turnFrames` count to `dist/app.js`.
