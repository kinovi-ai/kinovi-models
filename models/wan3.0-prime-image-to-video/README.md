<h1 align="center">Wan 3.0 Prime Image-to-Video</h1>

<p align="center">
  Wan 3.0 Prime image-to-video on the Kinovi API — the faster Wan 3.0 tier. Animate one image as the opening frame, or give a first and a last frame and let the model fill in the motion.<br>
  2–30 second clips with a generated audio track, 480p to 1080p.
</p>

<p align="center">
  <img alt="Model id" src="https://img.shields.io/badge/model-wan3.0--prime--image--to--video-6366f1?style=flat-square">
  <img alt="Type" src="https://img.shields.io/badge/type-video-0ea5e9?style=flat-square">
  <img alt="From" src="https://img.shields.io/badge/from-%240.0877%20%2F%20s-22c55e?style=flat-square">
  <a href="https://kinovi.ai/models/wan3-prime-image-to-video"><img alt="Model page" src="https://img.shields.io/badge/kinovi.ai-model%20page-111827?style=flat-square"></a>
</p>

> Try it in the [Playground](https://kinovi.ai/app/gallery?model=wan3.0-prime-image-to-video) · Full reference at [kinovi.ai/docs/models/wan3.0-prime-image-to-video](https://kinovi.ai/docs/models/wan3.0-prime-image-to-video) · Get an [API key](https://kinovi.ai/app/api-keys)

<br>

## Run an example

```bash
# Put KINOVI_API_KEY in ../../.env, or:
export KINOVI_API_KEY=your-api-key   # https://kinovi.ai/app/api-keys

python3 image-to-video.py            # Python 3.8+, stdlib only
npx tsx image-to-video.ts            # Node.js 18+, no dependencies
bash image-to-video.sh               # curl only
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
      <td><b>Image to video</b></td>
      <td>Animate a still image passed in <code>imageUrls</code></td>
      <td><a href="./image-to-video.py"><code>.py</code></a></td>
      <td><a href="./image-to-video.ts"><code>.ts</code></a></td>
      <td><a href="./image-to-video.sh"><code>.sh</code></a></td>
    </tr>
    <tr>
      <td><b>First &amp; last frame</b></td>
      <td>Start on one image and end on another (2 <code>imageUrls</code>)</td>
      <td><a href="./first-last-frame-to-video.py"><code>.py</code></a></td>
      <td><a href="./first-last-frame-to-video.ts"><code>.ts</code></a></td>
      <td><a href="./first-last-frame-to-video.sh"><code>.sh</code></a></td>
    </tr>
  </tbody>
</table>

<br>

## Request

`POST https://kinovi.ai/api/v1/jobs/createTask`

```json
{
  "model": "wan3.0-prime-image-to-video",
  "inputs": {
    "prompt": "Bring this image to life: a slow push-in on the subject, gentle wind moving the details, soft natural light shifting across the scene.",
    "imageUrls": [
      "https://static.kinovi.ai/materials/20260705/1783247738434-3a5b9fbb.png"
    ],
    "duration": 5,
    "outputResolution": "720p"
  }
}
```

Response `200 OK` — the task is queued and credits are reserved. Use `taskId` to poll for the result.

```json
{
  "taskId": "task_y00qaaqrhxqkotsnyii85mbb"
}
```

<details>
<summary>Error responses</summary>

| HTTP | Body | When |
|:--|:--|:--|
| `400` | `{ "message": "Invalid inputs for model", "errors": [ … ] }` | A field has the wrong type or an unsupported value, for example no image or more than 2 `imageUrls`, `duration` outside 2–30, or a `videoUrls` field. `errors` lists each problem with its `path`. Nothing is charged. |
| `400` | `{ "message": "Unknown model" }` | `model` is not a Kinovi model id. |
| `400` | `{ "message": "Invalid request parameters" }` | The request body itself is malformed, for example `callBackUrl` is not a URL. |
| `401` | `{ "message": "Invalid API Key" }` | Missing or wrong `Authorization` header. |
| `402` | `{ "message": "Insufficient credits", "required": 194.15, "available": 0 }` | Not enough credits for this duration × resolution. |
| `429` | `{ "message": "Concurrency limit reached (…)", "limit": 5, "current": 5 }` | Too many tasks in progress; wait for one to finish. |

</details>

| Field | Type | Default | Description |
|:--|:--|:--|:--|
| `model` | `string` | **required** | Must be `"wan3.0-prime-image-to-video"`. |
| `inputs.prompt` | `string` | **required** | What should happen in the video, in any language. Max **20,000** characters. |
| `inputs.imageUrls` | `string[]` | **required** | **1 or 2** image URLs (`.jpg` / `.png` / `.webp`). The first is the opening frame; the optional second is the closing frame. See [Reference images](#reference-images). |
| `inputs.aspectRatio` | `string` | `16:9` | `16:9` · `9:16` · `4:3` · `3:4` · `1:1` · `adaptive`. The image is recomposed to fill the chosen frame; `adaptive` keeps the first image's own ratio. |
| `inputs.duration` | `integer` | `5` | Clip length in seconds, an integer from `2` to `30`. |
| `inputs.outputResolution` | `string` | `720p` | `480p` · `720p` · `1080p`. |
| `inputs.audio` | `boolean` | `true` | Generate an audio track with the video. Set `false` for a silent clip. |
| `inputs.seed` | `integer` | random | `0`–`2147483647`. Omit for a random seed. |
| `callBackUrl` | `string` | – | Optional webhook called when the task finishes. |

### Full request

Only `model` and `inputs.prompt` are required (plus `inputs.imageUrls` here); the other fields are shown at their defaults or typical values.

<details>
<summary>All fields</summary>

```json
{
  "model": "wan3.0-prime-image-to-video",
  "inputs": {
    "prompt": "Bring this image to life: a slow push-in on the subject, gentle wind moving the details, soft natural light shifting across the scene.",
    "imageUrls": [
      "https://static.kinovi.ai/generated-images/task_u91bn4h34rr0zy2m5o9z31si-0.png",
      "https://static.kinovi.ai/generated-images/task_u91bn4h34rr0zy2m5o9z31si-1.png"
    ],
    "aspectRatio": "16:9",
    "duration": 5,
    "outputResolution": "720p",
    "audio": true,
    "seed": 42
  },
  "callBackUrl": "https://example.com/hooks/kinovi"
}
```

</details>

### Reference images

| You send | Result |
|:--|:--|
| 1 image | The image becomes the opening frame and is animated. |
| 2 images | The first image opens the clip, the second closes it; the prompt describes the move between them. |

With the default `aspectRatio` (`16:9`) a square or portrait image is recomposed into a full 16:9 frame — the model extends the scene rather than adding bars. Send `"aspectRatio": "adaptive"` to keep the image's own shape (a 1024×1024 image gives 640×640 at `480p`).

Every URL must be publicly reachable **by the generation backend**, not just from your machine. For local files, upload them first — see [kinovi.ai/docs/uploads](https://kinovi.ai/docs/uploads); uploaded files are kept for 24 hours. Images can be up to 8000×8000; very small images are rejected. An image that cannot be downloaded, or that appears to show a real person's face, ends the task in `fail` — see [Error codes](#error-codes).

### Standard and Prime

Wan 3.0 has three faces — text-to-video, image-to-video and reference-to-video — each in a standard and a Prime tier. [`wan3.0-image-to-video`](../wan3.0-image-to-video/README.md) takes the same inputs at a lower per-second price and roughly twice the wait. Switching is a one-line change of `model`. The other Wan 3.0 Prime faces: [`wan3.0-prime-text-to-video`](../wan3.0-prime-text-to-video/README.md) · [`wan3.0-prime-ref-to-video`](../wan3.0-prime-ref-to-video/README.md).

<br>

## Result

`GET https://kinovi.ai/api/v1/jobs/recordInfo?taskId=task_…`

Poll every few seconds until `status` is `success` or `fail`. A 5-second `720p` clip usually takes about 1 minute. Longer clips and `1080p` take longer; poll for at least 15 minutes before treating a task as stuck.

```json
{
  "taskId": "task_y00qaaqrhxqkotsnyii85mbb",
  "model": "wan3.0-prime-image-to-video",
  "status": "success",
  "creditsUsed": 194.15,
  "output": [
    {
      "url": "https://static.kinovi.ai/videos/wan3_1790101414392_933b6106.mp4",
      "width": 1280,
      "height": 720,
      "mediaType": "video/mp4"
    }
  ],
  "error": null,
  "createTime": 1790101363370,
  "completeTime": 1790101417885
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
| `output[0].url` | `string` | The video, `.mp4`, with an audio track unless `audio` is `false`. |
| `output[0].width` | `integer` | Pixel width, set by `aspectRatio` × `outputResolution` (1280×720 for `16:9` at `720p`); with `adaptive` it follows the first image's shape. |
| `output[0].height` | `integer` | Pixel height. |
| `output[0].mediaType` | `string` | `video/mp4`. |

`creditsUsed` is the amount charged at submit. It is not refund-adjusted: a `fail` still shows it, although the credits are back in your balance.

### Error codes

<details>
<summary>Error codes seen in <code>fail</code></summary>

| `error.code` | `error.message` (example) | Cause · what to do |
|:--|:--|:--|
| `500` | `Your content was blocked by moderation. Please adjust your prompt or uploaded media and try again.` | Content review flagged the prompt, a reference or the generated video. Change the prompt or the references. |
| `500` | `Wan 3.0 generation failed: FaceDetectionSuspect - The output content is suspected to include real human faces.` | The result looks like a real, identifiable person. Describe a fictional or stylised character instead. |
| `500` | `Wan 3.0 generation failed: FaceDetectionSuspect - The input content is suspected to include real human faces.` | A reference shows what looks like a real person's face. Use media without an identifiable real face. |
| `500` | `Your uploaded image may be restricted by copyright. Please use a different image.` | A reference was flagged as possible IP infringement. Use a different file. |
| `InvalidParameter` | `Failed to download your uploaded media. Please re-upload and try again.` | A URL could not be fetched. Check that it is public, or re-host it via [uploads](https://kinovi.ai/docs/uploads). |
| `InvalidParameter` | `Input image resolution is too low. Please use a higher-resolution image and try again.` | An image is too small (the upper bound is 8000×8000). Use a larger image. |
| `InvalidParameter` | `Wan 3.0 generation failed: InvalidParameter - Green net service failed to process the file.` | Content review could not read a reference file. Re-encode it as a standard `.jpg` / `.png` / `.mp4`, or replace it. |
| `500` | `Wan 3.0 generation failed: ServiceUnavailable - <503> InternalError.Algo: Service is temporarily unavailable. Please try again later.` | Temporary capacity problem. Retry after a short delay. |

</details>

<br>

## Pricing

Priced **per second of video**, by `outputResolution`. Reference images do not change the price. `duration` × the rate is charged at submit; failed tasks are refunded in full. Live prices: [kinovi.ai/models/wan3-prime-image-to-video](https://kinovi.ai/models/wan3-prime-image-to-video).

| | 480p | 720p | 1080p |
|:--|--:|--:|--:|
| **per second** | $0.0877 · 18.86 cr | $0.1806 · 38.83 cr | $0.3611 · 77.66 cr |

Example: the `image-to-video` and `first-last-frame-to-video` scripts generate 5 s at `720p` — **194.15 credits · $0.90**.

<br>

<p align="center">
  <a href="../../README.md">← All models</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/models/wan3-prime-image-to-video">Model page</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/app/gallery?model=wan3.0-prime-image-to-video">Playground</a>
</p>
