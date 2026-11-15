#!/usr/bin/env bash
# Usage: bash make-film.sh input.mp4   -> public/media/hero.mp4, hero-m.mp4, poster.jpg
# Every-frame keyframes so scrubbing backward is smooth.
set -e
IN="${1:?give an input video}"; OUT=public/media; mkdir -p "$OUT"
ffmpeg -y -i "$IN" -vf "scale=1920:-2" -c:v libx264 -crf 26 -g 1 -an -movflags +faststart "$OUT/hero.mp4"
ffmpeg -y -i "$IN" -vf "scale=720:-2" -c:v libx264 -crf 28 -g 1 -an -movflags +faststart "$OUT/hero-m.mp4"
ffmpeg -y -i "$IN" -vf "scale=1920:-2" -frames:v 1 -q:v 3 "$OUT/poster.jpg"
