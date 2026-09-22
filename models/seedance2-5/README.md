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

> Try it in the [Playground](https://kinovi.ai/app/gallery?model=seedance2-5) · Full reference at [kinovi.ai/docs/models](https://kinovi.ai/docs/models) · Get an [API key](https://kinovi.ai/app/api-keys)

To continue or edit an existing clip, use the dedicated models: [Seedance 2.5 Video Extend](../seedance2-5-extend/README.md) (`seedance2-5-extend`) and [Seedance 2.5 Video Edit](../seedance2-5-edit/README.md) (`seedance2-5-edit`). They take the same fields, require a `videoUrls` entry and handle the aspect ratio and duration for you.

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
| `400` | `{ "message": "Invalid inputs for model", "errors": [ … ] }` | A field has the wrong type or an unsupported value, for example `duration` outside 4–30, `outputResolution: "4k"` or a fractional `duration`. `errors` lists each problem with its `path`. Nothing is charged. |
| `400` | `{ "message": "Unknown model" }` | `model` is not a Kinovi model id. |
| `400` | `{ "message": "Invalid request parameters" }` | The request body itself is malformed, for example `callBackUrl` is not a URL. |
| `401` | `{ "message": "Invalid API Key" }` | Missing or wrong `Authorization` header. |
| `402` | `{ "message": "Insufficient credits", "required": 295, "available": 0 }` | Not enough credits for this duration × resolution. |
| `429` | `{ "message": "Concurrency limit reached (…)", "limit": 5, "current": 5 }` | Too many tasks in progress; wait for one to finish. |

</details>

| Field | Type | Default | Description |
|:--|:--|:--|:--|
| `model` | `string` | **required** | Must be `"seedance2-5"`. |
| `inputs.prompt` | `string` | **required** | What should happen in the video, in any language. Max **30,000** characters; longer is rejected with `400` before any credits are reserved. |
| `inputs.imageUrls` | `string[]` | – | Up to **30** publicly reachable image URLs (`.jpg` / `.png` / `.webp`). How they are used depends on `mode` — see [Reference media](#reference-media). |
| `inputs.videoUrls` | `string[]` | – | Up to **10** reference video URLs (`.mp4` / `.mov` / `.webm`), each 2–30 s and **30 s combined**. Any video switches the task to `reference` mode and to the reference-video rate; the videos' length is added to the bill after the task succeeds — see [Pricing](#pricing). Exceeding the combined limit ends the task in `fail` and refunds the credits. |
| `inputs.audioUrls` | `string[]` | – | Up to **10** audio URLs (`.mp3` / `.wav` / `.m4a` / `.aac` / `.ogg` / `.flac`), **30 s combined**. Any audio switches the task to `reference` mode. **Audio cannot be the only reference** — send at least one image or video with it. |
| `inputs.mode` | `string` | see description | `keyframe` · `reference`. `keyframe` animates 1–2 images as opening / closing frames. `reference` treats up to 30 images as subject / style references. When omitted, 1–2 images run as `keyframe`, 3 or more images run as `reference`, and any `videoUrls` / `audioUrls` entry forces `reference`. Other values are a `400`. |
| `inputs.duration` | `integer` | `5` | Clip length in seconds, an integer from `4` to `30`. Billing is per second. |
| `inputs.outputResolution` | `string` | `720p` | `480p` · `720p` · `1080p`. Sets the price tier. There is no `4k` on this model; `"4k"` is a `400`. |
| `inputs.aspectRatio` | `string` | see description | `16:9` · `9:16` · `1:1` · `4:3` · `3:4` · `21:9` — a closed list, `5:4` is a `400`. Defaults to `16:9` for text-to-video. Applies to text-to-video and to every `reference` task (images, videos or audio as references); in `reference` mode with `aspectRatio` omitted the frame is chosen from the references — a 9:16 reference video gives a 9:16 clip. `keyframe` tasks (1–2 images as frames) always keep the image's own ratio and ignore this field. See [Output size](#output-size). |
| `inputs.generate_audio` | `boolean` | `true` | Generate a synced audio track. Set `false` for a silent video (the file then has no audio stream). Must be a real boolean — `"yes"` is a `400`. |
| `inputs.bitrate_mode` | `string` | – | Set to `"high"` to request the higher-bitrate encode. The only accepted value; omit for the standard bitrate. |
| `inputs.output_format` | `string` | `mp4` | `mp4` · `mov`. With `mov` the result is a QuickTime file (`mediaType: "video/quicktime"`, `.mov` URL). Anything else is a `400`. |
| `inputs.seed` | `integer` | random | `0`–`4294967295`, or `-1` for random; other values are a `400`. Every run is randomised — the same seed does not reproduce a clip. The seed the model actually used comes back as `output[0].seed`. |
| `callBackUrl` | `string` | – | Optional webhook called when the task finishes. Must be a valid URL or the request is a `400`. |

Unknown `inputs` keys are ignored silently (no `400`), so a typo in a field name — `aspect_ratio` instead of `aspectRatio` — falls back to the default rather than failing.

### Full request

Only `model` and `inputs.prompt` are required; the other fields are shown at their defaults (`bitrate_mode` has no default — omit it for the standard bitrate). Any entry in `videoUrls` or `audioUrls` switches `mode` to `reference`; see [Reference media](#reference-media). Drop `imageUrls` for text-to-video.

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
| `prompt` only | text-to-video | Scene generated from scratch. `aspectRatio` defaults to `16:9`. |
| 1 image | `keyframe` | The image becomes the opening frame and is animated. The output keeps the image's aspect ratio. |
| 2 images | `keyframe` | First image is the opening frame, second is the closing frame. The output keeps the images' aspect ratio. |
| 3–30 images, no `mode` | `reference` | All images are used as subject / style references (there is no third keyframe). Send `"mode": "keyframe"` to force first / last frame instead — image 1 opens, image 2 closes, the rest are ignored. |
| 1–30 images + `"mode": "reference"` | `reference` | Images are subject / style references; the prompt describes the shot. `aspectRatio` applies (default `16:9`). |
| `videoUrls` (with or without images / audio) | `reference` | The clip's motion, framing and timing guide the output — describe the new subject or look in the prompt. `aspectRatio` applies; omitted, the output follows the video. To continue a clip use [`seedance2-5-extend`](../seedance2-5-extend/README.md); to change what is in it while keeping every frame use [`seedance2-5-edit`](../seedance2-5-edit/README.md). If a prompt sent to this model reads as an edit ("change the nail polish to…", "keep every motion"), the backend re-runs it as an edit: the output then has the source's length and `duration` is ignored. |
| `audioUrls` + at least one image or video | `reference` | The soundtrack drives the clip. Audio cannot be the only reference. |

Files must be publicly reachable **by the generation backend** at request time, not just from your machine. To use local files, upload them first via `POST /api/v1/uploads` and pass the returned URLs; uploaded files are kept for 24 hours. A reference the backend cannot fetch, or that fails media review, fails the task with `error.code = "asset_review_failed"` and a message naming the media (`"Reference image 1 failed review. Please replace it."`); the credits are refunded. A reference video that cannot be downloaded fails within seconds with `"Failed to download your reference video…"`.

<br>

## Result

`GET https://kinovi.ai/api/v1/jobs/recordInfo?taskId=task_…`

Poll every couple of seconds until `status` is `success` or `fail`. A 4–5 second clip typically takes 3–6 minutes at `480p` and `720p`, and 4–11 minutes at `1080p`; a 30-second clip takes about 6 minutes at `480p`. Tasks with a reference video take 4–7 minutes. Poll for at least 15 minutes before treating a task as stuck.

`output[0].url` is an `.mp4` (24 fps, AAC audio; H.264 at `480p` / `720p`, HEVC at `1080p`) with the generated audio track — a `.mov` with PCM audio when `output_format` is `mov`, and with no audio stream when `generate_audio` is `false`. `width` / `height` follow the effective aspect ratio and `outputResolution`; the clip is `duration` seconds long (+ 0.06 s). Two extra fields come back with every video: `seed`, the seed actually used, and `lastFrameImage`, a JPEG of the final frame.

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
| `output[0].url` | `string` | The video: `.mp4` with AAC audio (H.264 at `480p` / `720p`, HEVC at `1080p`), or `.mov` with PCM audio when `output_format` is `mov`. Stored by Kinovi; not subject to the 24-hour rule that applies to uploads. |
| `output[0].width` | `integer` | Pixel width — see [Output size](#output-size). |
| `output[0].height` | `integer` | Pixel height. |
| `output[0].mediaType` | `string` | `video/mp4`, or `video/quicktime` for `mov`. |
| `output[0].seed` | `integer` | The seed actually used, whether you set one or not. |
| `output[0].lastFrameImage` | `string` | JPEG of the final frame. This is a **temporary signed link** on the generation backend, valid for 24 hours from completion and up to 100 downloads — copy the image to your own storage if you need it later. Use it as `imageUrls[0]` of a follow-up `keyframe` task to continue the shot. |

`creditsUsed` is the amount reserved at submit; for a task with a reference video it becomes the settled amount a few seconds after `status` turns `success` (see [Pricing](#pricing)) — read it again if you poll right at completion; `recordInfo` does not carry a refund flag, so a `fail` still shows the original `creditsUsed` even though the credits are back in your balance.

### Error codes

<details>
<summary>Error codes seen in <code>fail</code></summary>

| `error.code` | `error.message` (example) | Cause |
|:--|:--|:--|
| `asset_review_failed` | `Reference image 1 failed review. Please replace it.` | The named reference (1-based index, per kind) was rejected by media review **or could not be fetched by the backend**. Re-host the file (for example via `/api/v1/uploads`) and retry. |
| `InvalidParameter` | ``The parameter `content[0].text.text` specified in the request is not valid: text content must contain …`` | `prompt` is empty. |
| `InvalidParameter` | ``The parameter `content` specified in the request is not valid: the parameter video total duration …`` | `videoUrls` add up to more than 30 s. |
| `1001` | `Failed to download your reference video. Please replace it or try again.` | A `videoUrls` entry returned an error when downloaded. Fails within seconds. |
| `1001` | `Your uploaded video may contain sensitive content. Please use a different video.` | A reference video was rejected by content moderation (`Your uploaded image …` for images). |
| `1001` | `The generated video did not pass review. Please modify your prompt or inputs and try again.` | The rendered clip (or its audio: `The generated audio …`) failed moderation. Rephrase the prompt or change the references. |
| `1001` | `The generated video may violate platform or copyright rules. Please modify your prompt or inputs and try again.` | Moderation flagged the output for a policy or copyright reason. |
| `1001` | `Service temporarily unavailable. Please try again later.` | Capacity problem on the generation side. Retry after a short delay. |

</details>

### Output size

Pixel dimensions per `aspectRatio` and `outputResolution`. `output[0].width` / `height` report the same numbers as the file.

| `aspectRatio` | `480p` | `720p` | `1080p` |
|:--|--:|--:|--:|
| `16:9` | 854×480 | 1280×720 | 1920×1080 |
| `9:16` | 480×854 | 720×1280 | 1080×1920 |
| `1:1` | 640×640 | 960×960 | 1440×1440 |
| `4:3` | 752×560 | 1112×834 | 1664×1248 |
| `3:4` | 560×752 | 834×1112 | 1248×1664 |
| `21:9` | 992×432 | 1470×630 | 2206×946 |

Image-to-video keeps the image's own ratio, so its dimensions are not on this grid — a 16:9 image gives 1284×716 at `720p`, for example.

<br>

## Pricing

Priced **per second of video**, by `outputResolution`. Reference images and audio do not change the price. Live prices: [kinovi.ai/models/seedance2-5](https://kinovi.ai/models/seedance2-5).

| | 480p | 720p | 1080p |
|:--|--:|--:|--:|
| **per second** | $0.1197 · 26 cr | $0.2717 · 59 cr | $0.6605 · 143.4 cr |
| **per second, with reference video** | $0.0737 · 16 cr | $0.1612 · 35 cr | $0.3947 · 85.68 cr |

**Text or image input:** `duration` × the per-second rate is charged at submit and is the final price.

**With a reference video:** the task moves to the reference-video rate, and the reference footage is billed too. At submit, `duration` × the reference rate is reserved. When the task succeeds the bill is settled to `(reference video seconds, capped at 30) + duration`, rounded to the whole second, at the reference rate — so the final charge is higher than the reservation. A 10 s reference clip with `duration: 4` at `480p` reserves 64 credits and settles at 14 × 16 = 224 credits; two clips of 20 s and 6 s with `duration: 4` settle at 30 × 16 = 480 credits. If the prompt contains editing words ("edit", "replace", "turn into", "change … to"), the bill is `2 × reference video seconds` instead — the output then follows the source. For editing, use [`seedance2-5-edit`](../seedance2-5-edit/README.md), where this is the documented behaviour.

Failed tasks are refunded in full.

Examples: the text-to-video, image-to-video, first-last-frame-to-video and omni-reference-to-video scripts generate 5 s at `720p` (**295 credits · $1.36**). reference-to-video generates 5 s at `720p` from a 10 s reference clip: **175 credits ($0.81)** are reserved at submit and the task settles at 15 s × 35 cr = **525 credits · $2.42**.

<br>

<p align="center">
  <a href="../../README.md">← All models</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/models/seedance2-5">Model page</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/app/gallery?model=seedance2-5">Playground</a>
</p>
