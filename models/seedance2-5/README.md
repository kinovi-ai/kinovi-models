<h1 align="center">Seedance 2.5</h1>

<p align="center">
  ByteDance's Seedance 2.5 on the Kinovi API. Text to video, image to video (single frame or first/last keyframes), or reference-driven generation from up to 30 images, 10 videos and 10 audio clips.<br>
  4–30 second clips with a generated audio track, 480p to 1080p.
</p>

<p align="center">
  <img alt="Model id" src="https://img.shields.io/badge/model-seedance2--5-6366f1?style=flat-square">
  <img alt="Type" src="https://img.shields.io/badge/type-video-0ea5e9?style=flat-square">
  <img alt="From" src="https://img.shields.io/badge/from-%240.0737%20%2F%20s-22c55e?style=flat-square">
  <a href="https://kinovi.ai/models/seedance2-5"><img alt="Model page" src="https://img.shields.io/badge/kinovi.ai-model%20page-111827?style=flat-square"></a>
</p>

> Try it in the [Playground](https://kinovi.ai/app/gallery?model=seedance2-5) · Full reference at [kinovi.ai/docs/models](https://kinovi.ai/docs/models) · Get an [API key](https://kinovi.ai/api-keys)

<br>

## Run an example

```bash
# Put KINOVI_API_KEY in ../../.env, or:
export KINOVI_API_KEY=your-api-key   # https://kinovi.ai/api-keys

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
  </tbody>
</table>

<br>

## Request

`POST https://kinovi.ai/api/v1/jobs/createTask`

```json
{
  "model": "seedance2-5",
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
  "taskId": "task_hodwdxdgbd101rr3zsdrxnh7"
}
```

<details>
<summary>Error responses</summary>

| HTTP | Body | When |
|:--|:--|:--|
| `400` | `{ "message": "Invalid inputs for model", "errors": [ … ] }` | A field has the wrong type or an unsupported value, for example `duration` outside 4–30 or `outputResolution: "4k"`. `errors` lists each problem with its `path`. Nothing is charged. |
| `400` | `{ "message": "Unknown model" }` | `model` is not a Kinovi model id. |
| `400` | `{ "message": "Invalid request parameters" }` | The request body itself is malformed, for example `callBackUrl` is not a URL. |
| `401` | `{ "message": "Invalid API Key" }` | Missing or wrong `Authorization` header. |
| `402` | `{ "message": "Insufficient credits", "required": 295, "available": 0 }` | Not enough credits for this duration × resolution. |
| `429` | `{ "message": "Concurrency limit reached (…)", "limit": 5, "current": 5 }` | Too many tasks in progress; wait for one to finish. |

</details>

| Field | Type | Default | Description |
|:--|:--|:--|:--|
| `model` | `string` | **required** | Must be `"seedance2-5"`. |
| `inputs.prompt` | `string` | **required** | What should happen in the video, in any language. Max **30,000** characters. |
| `inputs.imageUrls` | `string[]` | – | Up to **30** image URLs (`.jpg` / `.png` / `.webp`). How they are used depends on `mode` — see [Reference media](#reference-media). |
| `inputs.videoUrls` | `string[]` | – | Up to **10** reference video URLs (`.mp4` / `.mov` / `.webm`), each 2–30 s and **30 s combined**. Switches the task to `reference` mode and the reference-video rate — see [Pricing](#pricing). |
| `inputs.audioUrls` | `string[]` | – | Up to **10** audio URLs (`.mp3` / `.wav` / `.m4a` / `.aac` / `.ogg` / `.flac`), **30 s combined**. **Audio cannot be the only reference** — send at least one image or video with it. |
| `inputs.mode` | `string` | see description | `keyframe` · `reference`. `keyframe` animates 1–2 images as opening / closing frames; `reference` uses images as subject / style references. When omitted, 1–2 images run as `keyframe`, 3 or more as `reference`, and any video or audio forces `reference`. |
| `inputs.duration` | `integer` | `5` | Clip length in seconds, an integer from `4` to `30`. |
| `inputs.outputResolution` | `string` | `720p` | `480p` · `720p` · `1080p`. |
| `inputs.aspectRatio` | `string` | `16:9` | `16:9` · `9:16` · `1:1` · `4:3` · `3:4` · `21:9`. Used by text-to-video and `reference` tasks; `keyframe` tasks keep the image's own ratio. In `reference` mode with no `aspectRatio`, the frame follows the references. See [Output sizes](#output-sizes). |
| `inputs.generate_audio` | `boolean` | `true` | Generate a synced audio track. Set `false` for a silent video. |
| `inputs.bitrate_mode` | `string` | – | Set to `"high"` for a higher-bitrate encode; omit for the standard bitrate. |
| `inputs.output_format` | `string` | `mp4` | `mp4` · `mov`. |
| `inputs.seed` | `integer` | random | `0`–`4294967295`, or `-1` for random. The same seed does not reproduce a clip; the seed actually used comes back as `output[0].seed`. |
| `callBackUrl` | `string` | – | Optional webhook called when the task finishes. |

### Full request

Only `model` and `inputs.prompt` are required; the other fields are shown at their defaults or typical values. Drop `imageUrls` for text-to-video.

<details>
<summary>All fields</summary>

```json
{
  "model": "seedance2-5",
  "inputs": {
    "prompt": "The camera slowly pushes in as steam rises from the cup and sunlight flickers across the table.",
    "imageUrls": [
      "https://static.kinovi.ai/generated-images/task_ff01ii3zvib7ndbx8negnh6q-0.png"
    ],
    "videoUrls": [],
    "audioUrls": [],
    "mode": "keyframe",
    "duration": 5,
    "outputResolution": "720p",
    "aspectRatio": "16:9",
    "generate_audio": true,
    "bitrate_mode": "high",
    "output_format": "mp4",
    "seed": -1
  },
  "callBackUrl": "https://example.com/hooks/kinovi"
}
```

</details>

### Reference media

| You send | Mode | Result |
|:--|:--|:--|
| `prompt` only | text-to-video | Scene generated from scratch. |
| 1 image | `keyframe` | The image becomes the opening frame and is animated. |
| 2 images | `keyframe` | First image opens the clip, second closes it. |
| 1–30 images + `"mode": "reference"` (3+ images default to this) | `reference` | Images are subject / style references; the prompt describes the shot. |
| `videoUrls` (optionally with images / audio) | `reference` | The clip's motion, framing and timing guide the output; describe the new subject or look in the prompt. |
| `audioUrls` + at least one image or video | `reference` | The soundtrack drives the clip. |

To continue a clip, use [`seedance2-5-extend`](../seedance2-5-extend/README.md); to change what is in a clip while keeping its motion, use [`seedance2-5-edit`](../seedance2-5-edit/README.md).

Every URL must be publicly reachable **by the generation backend**, not just from your machine. For local files, upload them first — see [kinovi.ai/docs/uploads](https://kinovi.ai/docs/uploads); uploaded files are kept for 24 hours. A reference that cannot be fetched or fails media review ends the task in `fail` with `asset_review_failed`, and the credits are refunded.

### Output sizes

| `aspectRatio` | `480p` | `720p` | `1080p` |
|:--|--:|--:|--:|
| `16:9` | 854×480 | 1280×720 | 1920×1080 |
| `9:16` | 480×854 | 720×1280 | 1080×1920 |
| `1:1` | 640×640 | 960×960 | 1440×1440 |
| `4:3` | 752×560 | 1112×834 | 1664×1248 |
| `3:4` | 560×752 | 834×1112 | 1248×1664 |
| `21:9` | 992×432 | 1470×630 | 2206×946 |

`keyframe` tasks keep the image's ratio, so their size is close to but not on this grid (a 16:9 image gives 1284×716 at `720p`).

<br>

## Result

`GET https://kinovi.ai/api/v1/jobs/recordInfo?taskId=task_…`

Poll every few seconds until `status` is `success` or `fail`. A 5-second clip usually takes 3–6 minutes at `480p` / `720p` and 4–11 minutes at `1080p`; tasks with a reference video take 4–7 minutes. Poll for at least 15 minutes before treating a task as stuck.

```json
{
  "taskId": "task_hodwdxdgbd101rr3zsdrxnh7",
  "model": "seedance2-5",
  "status": "success",
  "creditsUsed": 295,
  "output": [
    {
      "url": "https://static.kinovi.ai/videos/seedance_video_1790090988835_9aa241b4.mp4",
      "width": 1280,
      "height": 720,
      "mediaType": "video/mp4",
      "seed": 53629,
      "lastFrameImage": "https://ark-acg-cn-beijing.tos-cn-beijing.volces.com/doubao-seedance-2-5/…/cgt-20260922232536-nl0kv.jpeg?X-Tos-Expires=86400&…"
    }
  ],
  "error": null,
  "createTime": 1790090613532,
  "completeTime": 1790090988835
}
```

| `status` | Meaning |
|:--|:--|
| `waiting` | Queued, not started yet |
| `generating` | Running |
| `success` | Done — read `output[].url` |
| `fail` | Failed — see `error.code` / `error.message`; credits are refunded |

### Output fields

`output` has exactly one item.

| Field | Type | Description |
|:--|:--|:--|
| `output[0].url` | `string` | The video: `.mp4`, or `.mov` when `output_format` is `mov`. |
| `output[0].width` | `integer` | Pixel width — see [Output sizes](#output-sizes). |
| `output[0].height` | `integer` | Pixel height. |
| `output[0].mediaType` | `string` | `video/mp4`, or `video/quicktime` for `mov`. |
| `output[0].seed` | `integer` | The seed actually used. |
| `output[0].lastFrameImage` | `string` | JPEG of the final frame — use it as `imageUrls[0]` of a follow-up `keyframe` task to continue the shot. Temporary link, valid for 24 hours; save a copy if you need it later. |

For tasks with a reference video, `creditsUsed` is updated to the final amount shortly after `status` turns `success` (see [Pricing](#pricing)). It is not refund-adjusted: a `fail` still shows the reserved amount, although the credits are back in your balance.

### Error codes

<details>
<summary>Error codes seen in <code>fail</code></summary>

| `error.code` | `error.message` (example) | Cause · what to do |
|:--|:--|:--|
| `asset_review_failed` | `Reference image 1 failed review. Please replace it.` | The named reference could not be fetched or was rejected by media review. Re-host the file (see [uploads](https://kinovi.ai/docs/uploads)) or replace it. |
| `InvalidParameter` | ``The parameter `content` specified in the request is not valid: the parameter video total duration …`` | `videoUrls` add up to more than 30 s. Trim or drop a clip. |
| `1001` | `Failed to download your reference video. Please replace it or try again.` | A `videoUrls` entry could not be downloaded. Check the URL. |
| `1001` | `Your uploaded video may contain sensitive content. Please use a different video.` | A reference was rejected by content moderation (`Your uploaded image …` for images). Use different media. |
| `1001` | `The generated video did not pass review. Please modify your prompt or inputs and try again.` | The result failed moderation. Change the prompt or references. |
| `1001` | `The generated video may violate platform or copyright rules. Please modify your prompt or inputs and try again.` | The result was flagged for a policy or copyright reason. Change the prompt or references. |
| `1001` | `Service temporarily unavailable. Please try again later.` | Temporary capacity problem. Retry after a short delay. |

</details>

<br>

## Pricing

Priced **per second of video**, by `outputResolution`. Reference images and audio do not change the price. Live prices: [kinovi.ai/models/seedance2-5](https://kinovi.ai/models/seedance2-5).

| | 480p | 720p | 1080p |
|:--|--:|--:|--:|
| **per second** | $0.1197 · 26 cr | $0.2717 · 59 cr | $0.6605 · 143.4 cr |
| **per second, with reference video** | $0.0737 · 16 cr | $0.1612 · 35 cr | $0.3947 · 85.68 cr |

Without a reference video, `duration` × the rate is charged at submit. With a reference video, the reference rate applies to the reference footage plus the output: `duration` × the rate is reserved at submit, and on success the charge becomes `(reference video seconds, up to 30) + duration` at that rate. Failed tasks are refunded in full.

Examples: the text-to-video, image-to-video, first-last-frame-to-video and omni-reference-to-video scripts generate 5 s at `720p` — **295 credits · $1.36**. reference-to-video generates 5 s at `720p` from a 10 s clip — **525 credits · $2.42** (15 s × 35 cr).

<br>

<p align="center">
  <a href="../../README.md">← All models</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/models/seedance2-5">Model page</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/app/gallery?model=seedance2-5">Playground</a>
</p>
