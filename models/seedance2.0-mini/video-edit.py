#!/usr/bin/env python3
# video-edit.py — Edit an existing clip with Seedance 2.0 Mini on Kinovi: keep its motion and framing, change what is in it.
#
# Usage:
#   Put KINOVI_API_KEY in a .env file (repo root or this folder), or:
#   export KINOVI_API_KEY=your-api-key     # https://kinovi.ai/api-keys
#   python3 video-edit.py
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
        "Edit this video. Keep the same hand, the same slow hand movements and the same "
        "camera framing, but change the nail polish to glossy black with fine gold flakes and "
        "change the grey ribbed sweater to a deep burgundy one. Everything else stays "
        "identical."
    ),
    # The clip to edit goes in videoUrls (up to 15 s). Describe what to change and what to keep;
    # the output follows the source frame by frame. Match duration to the source length.
    "videoUrls": [
        "https://static.kinovi.ai/videos/seedance_video_1775631198994_17cd129c.mp4",
    ],
    "mode": "reference",
    "duration": 10,               # match the source clip (10 s); 4-15 seconds, billed per second
    "outputResolution": "720p",   # 480p | 720p
    # Omit aspectRatio to keep the source clip's ratio (9:16 here).
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
    filename = f"video-edit-{i}{ext}" if len(info["output"]) > 1 else f"video-edit{ext}"
    with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "kinovi-models/1.0"})) as res:
        with open(filename, "wb") as f:
            f.write(res.read())
    print(f"Saved {filename}  ({item.get('width')}x{item.get('height')})  {url}")
