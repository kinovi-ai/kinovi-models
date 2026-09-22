<h1 align="center">Seedance 2.5 Video Extend</h1>

<p align="center">
  Continue an existing clip with Seedance 2.5 on the Kinovi API. Pass the video, describe what happens next and choose how many seconds to generate — the output is the new footage, starting on the source's last frame, in the source's aspect ratio.<br>
  4–30 seconds of new footage, 480p to 1080p.
</p>

<p align="center">
  <img alt="Model id" src="https://img.shields.io/badge/model-seedance2--5--extend-6366f1?style=flat-square">
  <img alt="Type" src="https://img.shields.io/badge/type-video-0ea5e9?style=flat-square">
  <img alt="From" src="https://img.shields.io/badge/from-%240.0737%20%2F%20s-22c55e?style=flat-square">
  <a href="https://kinovi.ai/models/seedance2-5-extend"><img alt="Model page" src="https://img.shields.io/badge/kinovi.ai-model%20page-111827?style=flat-square"></a>
</p>

> Try it in the [Playground](https://kinovi.ai/app/gallery?model=seedance2-5-extend) · Full reference at [kinovi.ai/docs/models](https://kinovi.ai/docs/models) · Get an [API key](https://kinovi.ai/app/api-keys)

This is the extension face of [Seedance 2.5](../seedance2-5/README.md): same fields, same prices, but `videoUrls` and `duration` are required, the aspect ratio always follows the source clip, and the backend knows the task is an extension without any special wording in the prompt. To restyle or edit a clip instead, use [Seedance 2.5 Video Edit](../seedance2-5-edit/README.md).

<br>

## Run an example

```bash
# Put KINOVI_API_KEY in ../../.env, or:
export KINOVI_API_KEY=your-api-key   # https://kinovi.ai/app/api-keys

python3 video-extend.py              # Python 3.8+, stdlib only
npx tsx video-extend.ts              # Node.js 18+, no dependencies
bash video-extend.sh                 # curl only
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
      <td><b>Video extend</b></td>
      <td>Generate 5 seconds of new action that continues a 10-second clip, at 720p</td>
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
  "model": "seedance2-5-extend",
  "inputs": {
    "prompt": "The hand slowly turns palm-up, the fingers spread, then the hand picks up a small gold ring from the table.",
    "videoUrls": ["https://static.kinovi.ai/videos/seedance_video_1775631198994_17cd129c.mp4"],
    "duration": 5,
    "outputResolution": "720p"
  }
}
```

Response `200 OK` — the task is queued and credits are reserved for the new footage. Use `taskId` to poll for the result.

```json
{
  "taskId": "task_tc23bff6wvanoqre8r79t4mm"
}
```

<details>
<summary>Error responses</summary>

| HTTP | Body | When |
|:--|:--|:--|
| `400` | `{ "message": "Invalid inputs for model", "errors": [ { "code": "custom", "message": "At least one reference video (videoUrls) is required.", "path": ["videoUrls"] } ] }` | `videoUrls` is missing or empty — images alone are not enough. |
| `400` | `{ "message": "Invalid inputs for model", "errors": [ { "code": "custom", "message": "Duration must be between 4 and 30 seconds", "path": ["duration"] } ] }` | `duration` is missing or outside 4–30. |
| `400` | `{ "message": "Invalid inputs for model", "errors": [ … ] }` | Another field has the wrong type or an unsupported value, for example `outputResolution: "4k"`. `errors` lists each problem with its `path`. Nothing is charged. |
| `400` | `{ "message": "Unknown model" }` | `model` is not a Kinovi model id. |
| `400` | `{ "message": "Invalid request parameters" }` | The request body itself is malformed, for example `callBackUrl` is not a URL. |
| `401` | `{ "message": "Invalid API Key" }` | Missing or wrong `Authorization` header. |
| `402` | `{ "message": "Insufficient credits", "required": 175, "available": 0 }` | Not enough credits for the reservation. |
| `429` | `{ "message": "Concurrency limit reached (…)", "limit": 5, "current": 5 }` | Too many tasks in progress; wait for one to finish. |

</details>

| Field | Type | Default | Description |
|:--|:--|:--|:--|
| `model` | `string` | **required** | Must be `"seedance2-5-extend"`. |
| `inputs.prompt` | `string` | **required** | What happens in the new footage, in any language. Describe only the continuation — the backend already tells the model this is an extension. Max **30,000** characters. |
| `inputs.videoUrls` | `string[]` | **required** | The clip to continue: a publicly reachable `.mp4` / `.mov` / `.webm` URL, 2–30 s long. Up to **10** videos, **30 s combined**; the first one is the clip that is continued. Longer footage ends the task in `fail` and refunds the credits. |
| `inputs.duration` | `integer` | **required** | Length of the **new** footage in seconds, an integer from `4` to `30`. This is the length of the output file — the source clip is not included in it. |
| `inputs.imageUrls` | `string[]` | – | Up to **30** optional reference images (`.jpg` / `.png` / `.webp`) for a subject or style that should appear in the continuation. |
| `inputs.audioUrls` | `string[]` | – | Up to **10** optional audio references (`.mp3` / `.wav` / `.m4a` / `.aac` / `.ogg` / `.flac`), **30 s combined**. |
| `inputs.outputResolution` | `string` | `720p` | `480p` · `720p` · `1080p`. Sets the price tier. `"4k"` is a `400`. |
| `inputs.generate_audio` | `boolean` | `true` | Generate a synced audio track. Set `false` for a silent video. Must be a real boolean. |
| `inputs.bitrate_mode` | `string` | – | Set to `"high"` to request the higher-bitrate encode. The only accepted value; omit for the standard bitrate. |
| `inputs.output_format` | `string` | `mp4` | `mp4` · `mov`. With `mov` the result is a QuickTime file (`mediaType: "video/quicktime"`). |
| `inputs.seed` | `integer` | random | `0`–`4294967295`, or `-1` for random; other values are a `400`. Every run is randomised — the same seed does not reproduce a clip. The seed the model used comes back as `output[0].seed`. |
| `callBackUrl` | `string` | – | Optional webhook called when the task finishes. Must be a valid URL or the request is a `400`. |

`inputs.mode` and `inputs.aspectRatio` are accepted for compatibility with `seedance2-5` but have no effect here: the task always runs in `reference` mode and the output keeps the source clip's aspect ratio. Unknown `inputs` keys are ignored silently.

### Full request

<details>
<summary>All fields</summary>

```json
{
  "model": "seedance2-5-extend",
  "inputs": {
    "prompt": "The hand slowly turns palm-up, the fingers spread, then the hand picks up a small gold ring from the table.",
    "videoUrls": [
      "https://static.kinovi.ai/videos/seedance_video_1775631198994_17cd129c.mp4"
    ],
    "imageUrls": [],
    "audioUrls": [],
    "duration": 5,
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

Files must be publicly reachable **by the generation backend** at request time, not just from your machine. To use local files, upload them first via `POST /api/v1/uploads` and pass the returned URLs; uploaded files are kept for 24 hours. A reference the backend cannot fetch, or that fails media review, fails the task with `error.code = "asset_review_failed"` and a message naming the media; the credits are refunded. A video that cannot be downloaded fails within seconds with `"Failed to download your reference video…"`.

<br>

## Result

`GET https://kinovi.ai/api/v1/jobs/recordInfo?taskId=task_…`

Poll every couple of seconds until `status` is `success` or `fail`. Expect 4–6 minutes for a 4–10 second extension at `480p` or `720p`; longer extensions and `1080p` take longer. Poll for at least 15 minutes before treating a task as stuck.

`output[0].url` is an `.mp4` (24 fps, AAC audio; H.264 at `480p` / `720p`, HEVC at `1080p`) containing **only the new footage**: it is `duration` seconds long, its first frame is the source's last frame, and it keeps the source's aspect ratio at the requested `outputResolution`. Concatenate it after the source yourself if you want one file. It is a `.mov` with PCM audio when `output_format` is `mov`, and has no audio stream when `generate_audio` is `false`. `seed` is the seed actually used and `lastFrameImage` a JPEG of the final frame (a temporary signed link valid for 24 hours and up to 100 downloads — copy it if you need it later; use it as `imageUrls[0]` of a `seedance2-5` keyframe task to keep going).

`creditsUsed` shows the reservation while the task runs and the settled amount once it succeeds (see [Pricing](#pricing)); settlement lands a few seconds after `status` turns `success`, so read it again if you poll right at completion. `recordInfo` does not carry a refund flag, so a `fail` still shows the reserved `creditsUsed` even though the credits are back in your balance.

```json
{
  "taskId": "task_tc23bff6wvanoqre8r79t4mm",
  "model": "seedance2-5-extend",
  "status": "success",
  "creditsUsed": 385,
  "output": [
    {
      "url": "https://static.kinovi.ai/videos/seedance_video_1790095158928_39591e51.mp4",
      "width": 720,
      "height": 1280,
      "mediaType": "video/mp4",
      "seed": 19905,
      "lastFrameImage": "https://ark-acg-cn-beijing.tos-cn-beijing.volces.com/doubao-seedance-2-5/…/cgt-20260923003627-734js.jpeg?X-Tos-Expires=86400&…"
    }
  ],
  "error": null,
  "createTime": 1790094884923,
  "completeTime": 1790095163664
}
```

This task continued a 6 s clip by 5 s at `720p`: 175 credits were reserved and 11 s × 35 cr = 385 credits settled.

| `status` | Meaning |
|:--|:--|
| `waiting` | Queued, not started yet |
| `generating` | Running |
| `success` | Done — read `output[].url` |
| `fail` | Failed — see `error.code` / `error.message`; credits are refunded |

<details>
<summary>Error codes seen in <code>fail</code></summary>

| `error.code` | `error.message` (example) | Cause |
|:--|:--|:--|
| `asset_review_failed` | `Reference video 1 failed review. Please replace it.` | The video was rejected by media review **or could not be fetched by the backend**. Re-host the file (for example via `/api/v1/uploads`) and retry. |
| `1001` | `Failed to download your reference video. Please replace it or try again.` | The `videoUrls` entry returned an error when downloaded. Fails within seconds. |
| `1001` | `Your uploaded video may contain sensitive content. Please use a different video.` | The source video was rejected by content moderation. |
| `1001` | `The generated video did not pass review. Please modify your prompt or inputs and try again.` | The rendered clip (or its audio: `The generated audio …`) failed moderation. |
| `1001` | `The generated video may violate platform or copyright rules. Please modify your prompt or inputs and try again.` | Moderation flagged the output for a policy or copyright reason. |
| `1001` | `Request parameters are invalid for video extension. Use adaptive aspect ratio.` | The backend could not run the clip as an extension. Retry; if it persists, shorten the source or the prompt. |
| `1001` | `Service temporarily unavailable. Please try again later.` | Capacity problem on the generation side. Retry after a short delay. |

</details>

<br>

## Pricing

Priced **per second at the reference-video rate** of the chosen `outputResolution` — the same rates as a `seedance2-5` task with a reference video. Reference images and audio do not change the price. Live prices: [kinovi.ai/models/seedance2-5-extend](https://kinovi.ai/models/seedance2-5-extend).

| | 480p | 720p | 1080p |
|:--|--:|--:|--:|
| **per second** | $0.0737 · 16 cr | $0.1612 · 35 cr | $0.3947 · 85.68 cr |

At submit, `duration` × the rate is reserved. When the task succeeds the bill is settled to `(source video seconds, capped at 30) + duration`, rounded to the whole second, at the same rate — so the final charge is higher than the reservation. A 6 s source with `duration: 4` at `480p` reserves 64 credits and settles at 10 × 16 = 160 credits; a 20 s source with `duration: 4` settles at 24 × 16 = 384 credits. Every video in `videoUrls` counts towards the source seconds. Failed tasks are refunded in full.

Example: the video-extend script continues a 10 s clip with 5 s of new footage at `720p` — **175 credits ($0.81)** are reserved at submit and the task settles at 15 s × 35 cr = **525 credits · $2.42**.

<br>

<p align="center">
  <a href="../../README.md">← All models</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/models/seedance2-5-extend">Model page</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/app/gallery?model=seedance2-5-extend">Playground</a>
</p>
