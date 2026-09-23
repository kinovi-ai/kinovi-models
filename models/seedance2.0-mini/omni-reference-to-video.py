#!/usr/bin/env python3
# omni-reference-to-video.py — Generate a video from several subject / style reference images with Seedance 2.0 Mini on Kinovi.
#
# Usage:
#   Put KINOVI_API_KEY in a .env file (repo root or this folder), or:
#   export KINOVI_API_KEY=your-api-key     # https://kinovi.ai/api-keys
#   python3 omni-reference-to-video.py
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

MODEL = "seedance2.0-mini"
INPUTS = {
    "prompt": (
        "A barista sets down the coffee cup from the reference images on a sunlit wooden "
        "counter, steam curling up, slow dolly-in, warm cinematic morning light."
    ),
    # "mode": "reference" turns every image into a subject / style reference (up to 9).
    # You can mix in up to 3 videoUrls (motion / camera reference, 15 s combined) and
    # up to 3 audioUrls (soundtrack, 15 s combined) — audio must be combined with an image or video.
    "imageUrls": [
        "https://static.kinovi.ai/generated-images/2026-09-10/seedream_5_pro_1789011790741_0.png",
        "https://static.kinovi.ai/generated-images/2026-09-10/nanobanana_pro_1789012003511.png",
        "https://static.kinovi.ai/generated-images/2026-09-10/gpt_image_2_1789005123161_0.png",
    ],
    "mode": "reference",
    "duration": 5,                # 4-15 seconds, billed per second
    "outputResolution": "720p",   # 480p | 720p
    "aspectRatio": "16:9",        # 16:9 | 9:16 | 1:1 | 4:3 | 3:4 | 21:9; omit to follow the references
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
    filename = f"omni-reference-to-video-{i}{ext}" if len(info["output"]) > 1 else f"omni-reference-to-video{ext}"
    with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "kinovi-models/1.0"})) as res:
        with open(filename, "wb") as f:
            f.write(res.read())
    print(f"Saved {filename}  ({item.get('width')}x{item.get('height')})  {url}")
