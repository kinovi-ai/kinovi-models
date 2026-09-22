<h1 align="center">Seedance 2.0 Fast</h1>

<p align="center">
  ByteDance's Seedance 2.0 tuned for turnaround, on the Kinovi API. Same inputs as Seedance 2.0 — text, images (single frame or first/last keyframes), up to 9 reference images, 3 videos and 3 audio clips — at 480p or 720p and a lower per-second price.<br>
  4–15 second clips with a generated audio track.
</p>

<p align="center">
  <img alt="Model id" src="https://img.shields.io/badge/model-seedance2--fast-6366f1?style=flat-square">
  <img alt="Type" src="https://img.shields.io/badge/type-video-0ea5e9?style=flat-square">
  <img alt="From" src="https://img.shields.io/badge/from-%240.0659%20%2F%20s-22c55e?style=flat-square">
  <a href="https://kinovi.ai/models/seedance2-fast"><img alt="Model page" src="https://img.shields.io/badge/kinovi.ai-model%20page-111827?style=flat-square"></a>
</p>

<table align="center">
  <tr>
    <th align="left">Try it</th>
    <th align="left">Price</th>
    <th align="left">Full docs</th>
    <th align="left">API key</th>
  </tr>
  <tr>
    <td><a href="https://kinovi.ai/app/gallery?model=seedance2-fast">Playground</a> · <a href="https://kinovi.ai/models/seedance2-fast">Model page</a></td>
    <td>$0.0659 / s · <a href="#pricing">details</a></td>
    <td><a href="https://kinovi.ai/docs/models">kinovi.ai/docs/models</a></td>
    <td><a href="https://kinovi.ai/app/api-keys">kinovi.ai/app/api-keys</a></td>
  </tr>
</table>

<br>

## Run an example

```bash
# Put KINOVI_API_KEY in ../../.env, or:
export KINOVI_API_KEY=your-api-key   # https://kinovi.ai/app/api-keys

python3 text-to-video.py             # Python 3.8+, stdlib only
npx tsx text-to-video.ts             # Node.js 18+, no dependencies
bash text-to-video.sh                # curl only
```

Each script submits a task, polls until it finishes, and saves the `.mp4` next to the script. Edit the `INPUTS` block at the top to change the prompt or options.

<table>
  <thead>
    <tr>
      <th align="left">Example</th>
      <th align="left">What it does</th>
      <th align="left">Python</th>
      <th align="left">TypeScript</th>
      <th align="left">curl</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Text to video</b></td>
      <td>Generate a 5-second 720p clip from a prompt</td>
      <td><a href="./text-to-video.py"><code>.py</code></a></td>
      <td><a href="./text-to-video.ts"><code>.ts</code></a></td>
      <td><a href="./text-to-video.sh"><code>.sh</code></a></td>
    </tr>
    <tr>
      <td><b>Image to video</b></td>
      <td>Animate a still image passed in <code>imageUrls</code></td>
      <td><a href="./image-to-video.py"><code>.py</code></a></td>
      <td><a href="./image-to-video.ts"><code>.ts</code></a></td>
      <td><a href="./image-to-video.sh"><code>.sh</code></a></td>
    </tr>
    <tr>
      <td><b>First &amp; last frame</b></td>
      <td>Start on one image and end on another (2 <code>imageUrls</code>, <code>mode: "keyframe"</code>)</td>
      <td><a href="./first-last-frame-to-video.py"><code>.py</code></a></td>
      <td><a href="./first-last-frame-to-video.ts"><code>.ts</code></a></td>
      <td><a href="./first-last-frame-to-video.sh"><code>.sh</code></a></td>
    </tr>
    <tr>
      <td><b>Omni reference</b></td>
      <td>Keep a subject / style from several reference images (<code>mode: "reference"</code>)</td>
      <td><a href="./omni-reference-to-video.py"><code>.py</code></a></td>
      <td><a href="./omni-reference-to-video.ts"><code>.ts</code></a></td>
      <td><a href="./omni-reference-to-video.sh"><code>.sh</code></a></td>
    </tr>
    <tr>
      <td><b>Reference to video</b></td>
      <td>Borrow the motion and camera work of a clip in <code>videoUrls</code> for a new subject or style</td>
      <td><a href="./reference-to-video.py"><code>.py</code></a></td>
      <td><a href="./reference-to-video.ts"><code>.ts</code></a></td>
      <td><a href="./reference-to-video.sh"><code>.sh</code></a></td>
    </tr>
    <tr>
      <td><b>Video edit</b></td>
      <td>Keep a clip's motion and framing, change what is in it (nail colour, clothing, …)</td>
      <td><a href="./video-edit.py"><code>.py</code></a></td>
      <td><a href="./video-edit.ts"><code>.ts</code></a></td>
      <td><a href="./video-edit.sh"><code>.sh</code></a></td>
    </tr>
    <tr>
      <td><b>Video extend</b></td>
      <td>Continue a clip from its last frame with new action</td>
      <td><a href="./video-extend.py"><code>.py</code></a></td>
      <td><a href="./video-extend.ts"><code>.ts</code></a></td>
      <td><a href="./video-extend.sh"><code>.sh</code></a></td>
    </tr>
  </tbody>
</table>

<br>

## Request

`POST https://kinovi.ai/api/v1/jobs/createTask`

```json
{
  "model": "seedance2-fast",
  "inputs": {
    "prompt": "A golden retriever running through autumn leaves in slow motion, cinematic depth of field, warm afternoon light.",
    "duration": 5,
    "outputResolution": "720p",
    "aspectRatio": "16:9"
  }
}
```

Response `200 OK` — the task is queued and credits are reserved. Use `taskId` to poll for the result.

```json
{
  "taskId": "task_d5ibgnwdlw8fe3zpptx9mp0f"
}
```

<details>
<summary>Error responses</summary>

| HTTP | Body | When |
|:--|:--|:--|
| `400` | `{ "message": "Invalid inputs for model", "errors": [ … ] }` | A field has the wrong type or an unsupported value, for example `duration` outside 4–15 or `outputResolution: "1080p"`. `errors` lists each problem with its `path`. Nothing is charged. |
| `400` | `{ "message": "Unknown model" }` | `model` is not exactly `"seedance2-fast"` (`"seedance-2-fast"` is rejected). |
| `401` | `{ "message": "Invalid API Key" }` | Missing or wrong `Authorization` header. |
| `402` | `{ "message": "Insufficient credits", "required": 140, "available": 0 }` | Not enough credits for this duration × resolution. |
| `429` | `{ "message": "Concurrency limit reached (…)", "limit": 5, "current": 5 }` | Too many tasks in progress; wait for one to finish. |

</details>

| Field | Type | Default | Description |
|:--|:--|:--|:--|
| `model` | `string` | **required** | Must be `"seedance2-fast"`. |
| `inputs.prompt` | `string` | **required** | What should happen in the video, in any language. Max **10,000** characters; longer is rejected with `400` before any credits are reserved. |
| `inputs.imageUrls` | `string[]` | – | Up to **9** publicly reachable image URLs (`.jpg` / `.png` / `.webp`). How they are used depends on `mode` — see [Reference media](#reference-media). |
| `inputs.videoUrls` | `string[]` | – | Up to **3** reference video URLs (`.mp4` / `.mov` / `.webm`), **15 s combined** across all videos. Any video switches the task to `reference` mode and to the reference-video price tier. The combined-duration limit is checked after the task is created: exceeding it ends the task in `fail` with `error.code = "InvalidParameter"` and refunds the credits. |
| `inputs.audioUrls` | `string[]` | – | Up to **3** audio URLs (`.mp3` / `.wav` / `.m4a` / `.aac` / `.ogg` / `.flac`), **15 s combined**. Any audio switches the task to `reference` mode. **Audio cannot be the only reference** — send at least one image or video with it, or the task fails with `InvalidParameter` ("Audio cannot be the only reference input") and is refunded. |
| `inputs.mode` | `string` | `keyframe` | `keyframe` · `reference`. `keyframe` animates 1–2 images as opening / closing frames. `reference` treats up to 9 images as subject / style references and is always used when `videoUrls` or `audioUrls` are given. Other values are a `400`. |
| `inputs.duration` | `integer` | `5` | Clip length in seconds, an integer from `4` to `15`. Billing is per second. |
| `inputs.outputResolution` | `string` | `720p` | `480p` · `720p`. Sets the price tier. `1080p` and `4k` are not available on this model and are a `400`. |
| `inputs.aspectRatio` | `string` | see description | `16:9` · `9:16` · `1:1` · `4:3` · `3:4` · `21:9` — a closed list, `5:4` is a `400`. Defaults to `16:9` for text-to-video. When any image, video or audio is given and `aspectRatio` is omitted, the output follows the reference media's ratio; set it to force a different frame. See [Output size](#output-size). |
| `inputs.generate_audio` | `boolean` | `true` | Generate a synced audio track. Set `false` for a silent video (the `.mp4` then has no audio stream). |
| `inputs.bitrate_mode` | `string` | – | Set to `"high"` for a higher-bitrate encode. The only accepted value; omit for the standard bitrate. |
| `inputs.seed` | `integer` | random | `0`–`4294967295`, or `-1` for random. The seed actually used is returned as `output[0].seed`. The same seed does **not** guarantee an identical clip; use it to vary results, not to reproduce them. |
| `callBackUrl` | `string` | – | Optional webhook called when the task finishes. Must be a valid URL or the request is a `400`. |

Unknown `inputs` keys are ignored silently (no `400`), so a typo in a field name — `aspect_ratio` instead of `aspectRatio` — falls back to the default rather than failing.

### Reference media

| You send | Mode | Result |
|:--|:--|:--|
| `prompt` only | text-to-video | Scene generated from scratch. `aspectRatio` defaults to `16:9`. |
| 1 image | `keyframe` | The image becomes the opening frame and is animated. |
| 2 images | `keyframe` | First image is the opening frame, second is the closing frame. |
| 3–9 images, no `mode` | `keyframe` | Still first / last frame: image 1 opens, image 2 closes, the rest are **ignored**. Add `"mode": "reference"` to use them all. |
| Up to 9 images + `"mode": "reference"` | `reference` | Images are subject / style references; the prompt describes the shot. |
| `videoUrls` (with or without images / audio) | `reference` | The prompt decides what the clip is used for: **restyle** it ("follow the movement and framing, but…" — a new subject or look with the same motion), **edit** it ("keep the same hand and camera, but change the nail polish to…" — the output follows the source frame by frame; match `duration` to the source), or **extend** it ("continue this video from its final frame…" — the output starts on the source's last frame). `mode` may be omitted; it is forced to `reference`. |
| `audioUrls` + at least one image or video | `reference` | The soundtrack drives the clip. Audio **alone** is rejected upstream (`InvalidParameter`). |

When media is given and `aspectRatio` is omitted, the output follows the reference: a 9:16 reference video or a portrait image yields a 9:16 clip, a landscape image yields 16:9. Set `aspectRatio` explicitly to force a different frame — a portrait image with `"aspectRatio": "16:9"` gives a 16:9 clip.

Files must be publicly reachable **by the generation backend** at request time, not just from your machine. To use local files, upload them first via `POST /api/v1/uploads` and pass the returned URLs; uploaded files are kept for 24 hours. A reference the backend cannot fetch, or that fails media review, fails the task with `error.code = "asset_review_failed"` and a message naming the media (`"Reference image 1 failed review. Please replace it."`); the credits are refunded. A reference video that cannot be downloaded fails within seconds with `"Failed to download your reference video…"`.

<br>

## Result

`GET https://kinovi.ai/api/v1/jobs/recordInfo?taskId=task_…`

Poll every couple of seconds until `status` is `success` or `fail`. A short clip typically takes 2–3 minutes at `480p` and 2–4 minutes at `720p`. Poll for at least 10 minutes before treating a task as stuck.

`output[0].url` is an `.mp4` (H.264, 24 fps, AAC audio) with the generated audio track — when `generate_audio` is `false` the file has no audio stream at all. `width` / `height` follow the effective aspect ratio and `outputResolution`; the clip is `duration` seconds long (± 0.1 s). Two extra fields come back with every video: `seed`, the seed actually used, and `lastFrameImage`, a PNG of the final frame at the video's resolution — handy as the opening image of a follow-up `keyframe` task.

```json
{
  "taskId": "task_d5ibgnwdlw8fe3zpptx9mp0f",
  "model": "seedance2-fast",
  "status": "success",
  "creditsUsed": 140,
  "output": [
    {
      "url": "https://static.kinovi.ai/videos/seedance_video_1790047887715_e16140a6.mp4",
      "width": 1280,
      "height": 720,
      "mediaType": "video/mp4",
      "seed": 60896,
      "lastFrameImage": "https://static.kinovi.ai/videos/seedance_video_1790047887715_e16140a6_lastframe.png"
    }
  ],
  "error": null,
  "createTime": 1790047790559,
  "completeTime": 1790047897906
}
```

| `status` | Meaning |
|:--|:--|
| `waiting` | Queued, not started yet |
| `generating` | Running |
| `success` | Done — read `output[].url` |
| `fail` | Failed — see `error.code` / `error.message`; credits are refunded |

`creditsUsed` is the amount reserved at submit; `recordInfo` does not carry a refund flag, so a `fail` still shows the original `creditsUsed` even though the credits are back in your balance.

<details>
<summary>Error codes seen in <code>fail</code></summary>

| `error.code` | `error.message` (example) | Cause |
|:--|:--|:--|
| `asset_review_failed` | `Reference image 1 failed review. Please replace it.` | The named reference (1-based index, per kind) was rejected by media review **or could not be fetched by the backend**. Re-host the file (for example via `/api/v1/uploads`) and retry. |
| `InvalidParameter` | `Audio cannot be the only reference input. Please also provide an image or video reference.` | `audioUrls` given without any image or video. |
| `InvalidParameter` | `Reference video total duration exceeds the limit. Please use videos with a combined duration of 15 seconds or less.` | `videoUrls` add up to more than 15 s. |
| `500` | `Failed to download your reference video. Please replace it or try again.` | A `videoUrls` entry returned an error when downloaded. Fails within seconds. |
| `500` | `Generation failed. Please try again.` | The generation backend returned an error. Credits are refunded; resubmit the same request. |

</details>

### Output size

Pixel dimensions per `aspectRatio` and `outputResolution`. `output[0].width` / `height` report the same numbers as the file.

| `aspectRatio` | `480p` | `720p` |
|:--|--:|--:|
| `16:9` | 864×496 | 1280×720 |
| `9:16` | 496×864 | 720×1280 |
| `1:1` | 640×640 | 960×960 |
| `4:3` | 752×560 | 1112×834 |
| `3:4` | 560×752 | 834×1112 |
| `21:9` | 992×432 | 1470×630 |

Note that `480p` is a shorthand — a 16:9 clip is 864×496, not 854×480.

<br>

## Pricing

Priced **per second of video**, by `outputResolution`. Attaching a reference video (`videoUrls`) moves the task to that resolution's reference tier. Reference images and audio do not change the price. The full `duration` is charged at submit and is the final price; failed tasks are refunded in full. Prices above are the list rates; a 25% launch discount applies until Oct 8, 2026. Live prices: [kinovi.ai/models/seedance2-fast](https://kinovi.ai/models/seedance2-fast).

| | 480p | 720p |
|:--|--:|--:|
| **per second** | $0.0659 · 14 cr | $0.1319 · 28 cr |
| **per second, with reference video** | $0.0848 · 18 cr | $0.1602 · 34 cr |

Examples: the text-to-video, image-to-video, first-last-frame-to-video and omni-reference-to-video scripts generate 5 s at `720p` (**140 credits · $0.66**); reference-to-video and video-extend also use 5 s at `720p` but include a reference video (**170 credits · $0.80**); video-edit matches its 10 s source clip (**340 credits · $1.60**).

<br>

<p align="center">
  <a href="../../README.md">← All models</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/models/seedance2-fast">Model page</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/app/gallery?model=seedance2-fast">Playground</a>
</p>
