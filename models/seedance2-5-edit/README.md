<h1 align="center">Seedance 2.5 Video Edit</h1>

<p align="center">
  Edit an existing clip with Seedance 2.5 on the Kinovi API. Pass the video and describe what to change — subject, colours, clothing, background, lighting or style — and the output follows the source's motion, at the source's length and aspect ratio.<br>
  Source clips of 4–30 seconds, 480p to 1080p.
</p>

<p align="center">
  <img alt="Model id" src="https://img.shields.io/badge/model-seedance2--5--edit-6366f1?style=flat-square">
  <img alt="Type" src="https://img.shields.io/badge/type-video-0ea5e9?style=flat-square">
  <img alt="From" src="https://img.shields.io/badge/from-%240.0737%20%2F%20s-22c55e?style=flat-square">
  <a href="https://kinovi.ai/models/seedance2-5-edit"><img alt="Model page" src="https://img.shields.io/badge/kinovi.ai-model%20page-111827?style=flat-square"></a>
</p>

> Try it in the [Playground](https://kinovi.ai/app/gallery?model=seedance2-5-edit) · Full reference at [kinovi.ai/docs/models](https://kinovi.ai/docs/models) · Get an [API key](https://kinovi.ai/api-keys)

<br>

## Run an example

```bash
# Put KINOVI_API_KEY in ../../.env, or:
export KINOVI_API_KEY=your-api-key   # https://kinovi.ai/api-keys

python3 video-edit.py                # Python 3.8+, stdlib only
npx tsx video-edit.ts                # Node.js 18+, no dependencies
bash video-edit.sh                   # curl only
```

The script submits a task, polls until it finishes, and saves the `.mp4` next to the script. Edit the `INPUTS` block at the top to change the clip, the prompt or the options.

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
      <td><b>Video edit</b></td>
      <td>Change the nail polish and sweater in a 10-second clip at 720p, keeping every movement</td>
      <td><a href="./video-edit.py"><code>.py</code></a></td>
      <td><a href="./video-edit.ts"><code>.ts</code></a></td>
      <td><a href="./video-edit.sh"><code>.sh</code></a></td>
    </tr>
  </tbody>
</table>

<br>

## Request

`POST https://kinovi.ai/api/v1/jobs/createTask`

```json
{
  "model": "seedance2-5-edit",
  "inputs": {
    "prompt": "Keep the same hand, movements and camera framing, but change the nail polish to glossy black with gold flakes and the grey sweater to deep burgundy.",
    "videoUrls": ["https://static.kinovi.ai/videos/seedance_video_1775631198994_17cd129c.mp4"],
    "outputResolution": "720p"
  }
}
```

Response `200 OK` — the task is queued and an estimate is reserved. Use `taskId` to poll for the result.

```json
{
  "taskId": "task_ne92iog6v9askax617ornkd8"
}
```

<details>
<summary>Error responses</summary>

| HTTP | Body | When |
|:--|:--|:--|
| `400` | `{ "message": "Invalid inputs for model", "errors": [ { "code": "custom", "message": "At least one reference video (videoUrls) is required.", "path": ["videoUrls"] } ] }` | `videoUrls` is missing or empty. |
| `400` | `{ "message": "Invalid inputs for model", "errors": [ … ] }` | Another field has the wrong type or an unsupported value, for example `outputResolution: "4k"`. `errors` lists each problem with its `path`. Nothing is charged. |
| `400` | `{ "message": "Unknown model" }` | `model` is not a Kinovi model id. |
| `400` | `{ "message": "Invalid request parameters" }` | The request body itself is malformed, for example `callBackUrl` is not a URL. |
| `401` | `{ "message": "Invalid API Key" }` | Missing or wrong `Authorization` header. |
| `402` | `{ "message": "Insufficient credits", "required": 525, "available": 0 }` | Not enough credits for the reservation. |
| `429` | `{ "message": "Concurrency limit reached (…)", "limit": 5, "current": 5 }` | Too many tasks in progress; wait for one to finish. |

</details>

| Field | Type | Default | Description |
|:--|:--|:--|:--|
| `model` | `string` | **required** | Must be `"seedance2-5-edit"`. |
| `inputs.prompt` | `string` | **required** | What to change and what to keep, in any language — for example "change the nail polish to emerald green, keep every movement". Max **30,000** characters. |
| `inputs.videoUrls` | `string[]` | **required** | The clip to edit (`.mp4` / `.mov` / `.webm`, **4–30 s**). The first video is the one that is edited; up to **10** videos, **30 s combined**. |
| `inputs.imageUrls` | `string[]` | – | Up to **30** reference images (`.jpg` / `.png` / `.webp`) showing the new subject, outfit or style. |
| `inputs.audioUrls` | `string[]` | – | Up to **10** audio references (`.mp3` / `.wav` / `.m4a` / `.aac` / `.ogg` / `.flac`), **30 s combined**. |
| `inputs.outputResolution` | `string` | `720p` | `480p` · `720p` · `1080p`. |
| `inputs.generate_audio` | `boolean` | `true` | Generate a synced audio track. Set `false` for a silent video. |
| `inputs.bitrate_mode` | `string` | – | Set to `"high"` for a higher-bitrate encode; omit for the standard bitrate. |
| `inputs.output_format` | `string` | `mp4` | `mp4` · `mov`. |
| `inputs.seed` | `integer` | random | `0`–`4294967295`, or `-1` for random. The same seed does not reproduce a clip; the seed actually used comes back as `output[0].seed`. |
| `callBackUrl` | `string` | – | Optional webhook called when the task finishes. |

There is no `duration` to set: the output has the source's length and aspect ratio.

### Full request

`model`, `inputs.prompt` and `inputs.videoUrls` are required; the other fields are shown at their defaults or typical values.

<details>
<summary>All fields</summary>

```json
{
  "model": "seedance2-5-edit",
  "inputs": {
    "prompt": "Keep the same hand, movements and camera framing, but change the nail polish to glossy black with gold flakes and the grey sweater to deep burgundy.",
    "videoUrls": [
      "https://static.kinovi.ai/videos/seedance_video_1775631198994_17cd129c.mp4"
    ],
    "imageUrls": [],
    "audioUrls": [],
    "outputResolution": "720p",
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

One source video is required; images and audio are optional extras. Every URL must be publicly reachable **by the generation backend**, not just from your machine. For local files, upload them first — see [kinovi.ai/docs/uploads](https://kinovi.ai/docs/uploads); uploaded files are kept for 24 hours. A file that cannot be fetched or fails media review ends the task in `fail` with `asset_review_failed`, and the credits are refunded.

<br>

## Result

`GET https://kinovi.ai/api/v1/jobs/recordInfo?taskId=task_…`

Poll every few seconds until `status` is `success` or `fail`. A 6–20 second source usually takes 4–6 minutes at `480p` / `720p`; `1080p` takes longer. Poll for at least 15 minutes before treating a task as stuck.

```json
{
  "taskId": "task_ne92iog6v9askax617ornkd8",
  "model": "seedance2-5-edit",
  "status": "success",
  "creditsUsed": 420,
  "output": [
    {
      "url": "https://static.kinovi.ai/videos/seedance_video_1790095137919_45863ecb.mp4",
      "width": 720,
      "height": 1280,
      "mediaType": "video/mp4",
      "seed": 78529,
      "lastFrameImage": "https://ark-acg-cn-beijing.tos-cn-beijing.volces.com/doubao-seedance-2-5/…/cgt-20260923003627-9x16s.jpeg?X-Tos-Expires=86400&…"
    }
  ],
  "error": null,
  "createTime": 1790094886124,
  "completeTime": 1790095143301
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
| `output[0].url` | `string` | The edited clip, with the source's length and aspect ratio. `.mp4`, or `.mov` when `output_format` is `mov`. |
| `output[0].width` | `integer` | Pixel width — the source's aspect ratio at `outputResolution`. |
| `output[0].height` | `integer` | Pixel height. |
| `output[0].mediaType` | `string` | `video/mp4`, or `video/quicktime` for `mov`. |
| `output[0].seed` | `integer` | The seed actually used. |
| `output[0].lastFrameImage` | `string` | JPEG of the final frame. Temporary link, valid for 24 hours; save a copy if you need it later. |

`creditsUsed` is updated to the final amount shortly after `status` turns `success` (see [Pricing](#pricing)). It is not refund-adjusted: a `fail` still shows the reserved amount, although the credits are back in your balance.

### Error codes

<details>
<summary>Error codes seen in <code>fail</code></summary>

| `error.code` | `error.message` (example) | Cause · what to do |
|:--|:--|:--|
| `asset_review_failed` | `Reference video 1 failed review. Please replace it.` | The video could not be fetched or was rejected by media review. Re-host the file (see [uploads](https://kinovi.ai/docs/uploads)) or replace it. |
| `1001` | `Failed to download your reference video. Please replace it or try again.` | The `videoUrls` entry could not be downloaded. Check the URL. |
| `1001` | `Request parameters are invalid for video editing. Use adaptive aspect ratio and automatic duration, and ensure the reference video is 4–30 seconds.` | The source clip is shorter than 4 s or longer than 30 s. Trim it into range. |
| `1001` | `Your uploaded video may contain sensitive content. Please use a different video.` | The source was rejected by content moderation. Use a different video. |
| `1001` | `The generated video did not pass review. Please modify your prompt or inputs and try again.` | The result failed moderation. Change the prompt. |
| `1001` | `The generated video may violate platform or copyright rules. Please modify your prompt or inputs and try again.` | The result was flagged for a policy or copyright reason. Change the prompt or source. |
| `1001` | `Service temporarily unavailable. Please try again later.` | Temporary capacity problem. Retry after a short delay. |

</details>

<br>

## Pricing

Priced **per second** by `outputResolution`, counting the source footage twice — once as input, once as output. Live prices: [kinovi.ai/models/seedance2-5-edit](https://kinovi.ai/models/seedance2-5-edit).

| | 480p | 720p | 1080p |
|:--|--:|--:|--:|
| **per second** | $0.0737 · 16 cr | $0.1612 · 35 cr | $0.3947 · 85.68 cr |

An estimate of 15 s × the rate is reserved at submit. On success the charge becomes `2 × source video seconds` (source up to 30 s) at the same rate, and the difference is charged or refunded — the response above edited a 6 s clip, so 12 s × 35 cr = 420 credits. Failed tasks are refunded in full.

Example: the video-edit script edits a 10 s clip at `720p` — **700 credits · $3.22** (20 s × 35 cr).

<br>

<p align="center">
  <a href="../../README.md">← All models</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/models/seedance2-5-edit">Model page</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/app/gallery?model=seedance2-5-edit">Playground</a>
</p>
