"""Find the useful turn in a square product clip and export WebP frames."""

import argparse
import json
import subprocess
from pathlib import Path

import imageio_ffmpeg
import numpy as np


def inspect(video, fps=24, size=160, settle_tolerance=.02):
    command = [imageio_ffmpeg.get_ffmpeg_exe(), "-hide_banner", "-loglevel", "error", "-i", str(video),
               "-an", "-vf", f"fps={fps},scale={size}:{size}", "-pix_fmt", "rgb24", "-f", "rawvideo", "pipe:1"]
    raw = subprocess.check_output(command)
    frames = np.frombuffer(raw, np.uint8).reshape(-1, size, size, 3).astype(np.float32) / 255
    # Exclude the bottom corner (video watermark) and uniform white margins.
    crop = frames[:, :int(size * .89), int(size * .1):int(size * .9)]
    foreground = crop.mean(axis=-1) < .94
    final = crop[-5:].mean(axis=0)
    region = foreground | (final.mean(axis=-1) < .94)[None, :, :]
    region = np.maximum(region.sum(axis=(1, 2)), 1)
    delta = np.abs(crop[1:] - crop[:-1]).mean(axis=-1)
    motion = np.r_[0, (delta * (foreground[1:] | foreground[:-1])).sum(axis=(1, 2)) / np.maximum((foreground[1:] | foreground[:-1]).sum(axis=(1, 2)), 1)]
    distance = (np.abs(crop - final).mean(axis=-1) * (foreground | (final.mean(axis=-1) < .94))).sum(axis=(1, 2)) / region
    peak = float(np.quantile(motion, .9))
    active = np.flatnonzero(motion > max(.006, peak * .22))
    start = max(0, int(active[0]) - 2) if len(active) else 0
    # First front pose sufficiently close to the final frame with little residual motion.
    settled = (distance < settle_tolerance) & (motion < .006)
    stable = np.flatnonzero(np.convolve(settled.astype(int), np.ones(4, dtype=int), 'valid') == 4)
    stable = stable[stable > start + 4]
    end = int(stable[0] + 3) if len(stable) else len(frames) - 1
    print(json.dumps({"fps": fps, "frame_count": len(frames), "start_frame": start,
                      "end_frame": end, "start_s": round(start / fps, 3), "end_s": round(end / fps, 3),
                      "motion": [round(float(x), 4) for x in motion],
                      "distance_to_final": [round(float(x), 4) for x in distance]}, indent=2))
    return start, end


def export(video, output, start, end, fps=24, mirror=False):
    output.mkdir(parents=True, exist_ok=True)
    filters = [f"select='between(n,{start},{end})'"]
    if mirror:
        filters.append("hflip")
    filters.append("scale=480:480:flags=lanczos")
    command = [imageio_ffmpeg.get_ffmpeg_exe(), "-hide_banner", "-loglevel", "error", "-i", str(video),
               "-an", "-vf", ",".join(filters),
               "-vsync", "0", "-c:v", "libwebp", "-quality", "79", "-compression_level", "6",
               "-y", str(output / "%03d.webp")]
    subprocess.run(command, check=True)
    count = len(list(output.glob("*.webp")))
    (output / "manifest.json").write_text(json.dumps({"frames": count, "duration_ms": 1100,
                                                       "mirrored": mirror,
                                                       "source_fps": fps, "source_start_frame": start,
                                                       "source_end_frame": end}, indent=2) + "\n")
    print(f"Exported {count} frames to {output}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("video", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--inspect-only", action="store_true")
    parser.add_argument("--settle-tolerance", type=float, default=.02)
    parser.add_argument("--mirror", action="store_true")
    args = parser.parse_args()
    first, last = inspect(args.video, settle_tolerance=args.settle_tolerance)
    if not args.inspect_only:
        export(args.video, args.output, first, last, mirror=args.mirror)
