#!/usr/bin/env python3
# first-last-frame-to-video.py — Move from a first frame to a last frame with Wan 3.0 on Kinovi.
#
# Usage:
#   Put KINOVI_API_KEY in a .env file (repo root or this folder), or:
#   export KINOVI_API_KEY=your-api-key     # https://kinovi.ai/api-keys
#   python3 first-last-frame-to-video.py
#
# No third-party dependencies. Python 3.8+.

import json
import os
import sys
import time
import urllib.request


def load_dotenv():
    folder = os.path.dirname(os.path.abspath(__file__))
    while True:
        path = os.path.join(folder, ".env")
        if os.path.isfile(path):
            with open(path, encoding="utf-8-sig") as handle:
                for raw in handle:
                    line = raw.strip()
                    if not line or line.startswith("#") or "=" not in line:
                        continue
                    key, _, value = line.partition("=")
                    key, value = key.strip(), value.strip().strip("'").strip('"')
                    if key and key not in os.environ:
                        os.environ[key] = value
            return
        parent = os.path.dirname(folder)
        if parent == folder:
            return
        folder = parent


load_dotenv()

MODEL = "wan3.0-image-to-video"
INPUTS = {
    "prompt": (
        "Smooth cinematic move from the first frame to the last frame: the camera glides "
        "around the coffee cup as steam rises and the morning light shifts across the table."
    ),
    # Exactly 2 images: the first is the opening frame, the second is the closing frame.
    "imageUrls": [
        "https://static.kinovi.ai/generated-images/task_u91bn4h34rr0zy2m5o9z31si-0.png",
        "https://static.kinovi.ai/generated-images/task_u91bn4h34rr0zy2m5o9z31si-1.png",
    ],
    "aspectRatio": "16:9",       # 16:9 | 9:16 | 4:3 | 3:4 | 1:1 | adaptive (keep the image's ratio)
    "duration": 5,               # 2-30 seconds, billed per second
    "outputResolution": "720p",  # 480p | 720p | 1080p
}

# ---- you normally don't need to edit below this line ----

API_BASE = "https://kinovi.ai/api/v1"
API_KEY = os.environ.get("KINOVI_API_KEY")
if not API_KEY:
    sys.exit("Set KINOVI_API_KEY first: export KINOVI_API_KEY=your-api-key")

HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
    "User-Agent": "kinovi-models/1.0",
}


def api(method, path, body=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(f"{API_BASE}{path}", data=data, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req) as res:
            return json.load(res)
    except urllib.error.HTTPError as err:
        sys.exit(f"HTTP {err.code} {path}: {err.read().decode()}")


# 1. Submit the task
task = api("POST", "/jobs/createTask", {"model": MODEL, "inputs": INPUTS})
task_id = task["taskId"]
print(f"Task created: {task_id}")

# 2. Poll until it reaches a terminal state (success | fail)
while True:
    info = api("GET", f"/jobs/recordInfo?taskId={task_id}")
    status = info["status"]
    if status == "success":
        break
    if status == "fail":
        sys.exit(f"Task failed: {json.dumps(info['error'])}")
    print(f"Status: {status} — waiting...")
    time.sleep(2)

# 3. Download the result
print(f"Done. Credits used: {info['creditsUsed']}")
for i, item in enumerate(info["output"]):
    url = item["url"]
    ext = os.path.splitext(url.split("?")[0])[1] or ".mp4"
    filename = f"first-last-frame-to-video-{i}{ext}" if len(info["output"]) > 1 else f"first-last-frame-to-video{ext}"
    with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "kinovi-models/1.0"})) as res:
        with open(filename, "wb") as f:
            f.write(res.read())
    print(f"Saved {filename}  ({item.get('width')}x{item.get('height')})  {url}")
