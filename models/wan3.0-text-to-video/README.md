<h1 align="center">Wan 3.0 Text-to-Video</h1>

<p align="center">
  Alibaba's Wan 3.0 text-to-video on the Kinovi API. Describe a shot and get a clip with a generated audio track.<br>
  2–30 seconds, 480p to 1080p, five aspect ratios.
</p>

<p align="center">
  <img alt="Model id" src="https://img.shields.io/badge/model-wan3.0--text--to--video-6366f1?style=flat-square">
  <img alt="Type" src="https://img.shields.io/badge/type-video-0ea5e9?style=flat-square">
  <img alt="From" src="https://img.shields.io/badge/from-%240.0663%20%2F%20s-22c55e?style=flat-square">
  <a href="https://kinovi.ai/models/wan3-text-to-video"><img alt="Model page" src="https://img.shields.io/badge/kinovi.ai-model%20page-111827?style=flat-square"></a>
</p>

> Try it in the [Playground](https://kinovi.ai/app/gallery?model=wan3.0-text-to-video) · Full reference at [kinovi.ai/docs/models/wan3.0-text-to-video](https://kinovi.ai/docs/models/wan3.0-text-to-video) · Get an [API key](https://kinovi.ai/app/api-keys)

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
  </tbody>
</table>

<br>

## Request

`POST https://kinovi.ai/api/v1/jobs/createTask`

```json
{
  "model": "wan3.0-text-to-video",
  "inputs": {
    "prompt": "A golden retriever running through autumn leaves in slow motion, cinematic depth of field, warm afternoon light.",
    "aspectRatio": "16:9",
    "duration": 5,
    "outputResolution": "720p"
  }
}
```

Response `200 OK` — the task is queued and credits are reserved. Use `taskId` to poll for the result.

```json
{
  "taskId": "task_rrbtuejrp14ryrtyc5ufsznp"
}
```

<details>
<summary>Error responses</summary>

| HTTP | Body | When |
|:--|:--|:--|
| `400` | `{ "message": "Invalid inputs for model", "errors": [ … ] }` | A field has the wrong type or an unsupported value, for example `duration` outside 2–30, `outputResolution: "4k"`, or any `imageUrls`. `errors` lists each problem with its `path`. Nothing is charged. |
| `400` | `{ "message": "Unknown model" }` | `model` is not a Kinovi model id. |
| `400` | `{ "message": "Invalid request parameters" }` | The request body itself is malformed, for example `callBackUrl` is not a URL. |
| `401` | `{ "message": "Invalid API Key" }` | Missing or wrong `Authorization` header. |
| `402` | `{ "message": "Insufficient credits", "required": 142.57, "available": 0 }` | Not enough credits for this duration × resolution. |
| `429` | `{ "message": "Concurrency limit reached (…)", "limit": 5, "current": 5 }` | Too many tasks in progress; wait for one to finish. |

</details>

| Field | Type | Default | Description |
|:--|:--|:--|:--|
| `model` | `string` | **required** | Must be `"wan3.0-text-to-video"`. |
| `inputs.prompt` | `string` | **required** | What should happen in the video, in any language. Max **20,000** characters. |
| `inputs.aspectRatio` | `string` | `16:9` | `16:9` · `9:16` · `4:3` · `3:4` · `1:1`. |
| `inputs.duration` | `integer` | `5` | Clip length in seconds, an integer from `2` to `30`. |
| `inputs.outputResolution` | `string` | `720p` | `480p` · `720p` · `1080p`. |
| `inputs.audio` | `boolean` | `true` | Generate an audio track with the video. Set `false` for a silent clip. |
| `inputs.seed` | `integer` | random | `0`–`2147483647`. Omit for a random seed. |
| `callBackUrl` | `string` | – | Optional webhook called when the task finishes. |

### Full request

Only `model` and `inputs.prompt` are required; the other fields are shown at their defaults or typical values.

<details>
<summary>All fields</summary>

```json
{
  "model": "wan3.0-text-to-video",
  "inputs": {
    "prompt": "A golden retriever running through autumn leaves in slow motion, cinematic depth of field, warm afternoon light.",
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

### Standard and Prime

Wan 3.0 has three faces — text-to-video, image-to-video and reference-to-video — each in a standard and a Prime tier. [`wan3.0-prime-text-to-video`](../wan3.0-prime-text-to-video/README.md) takes the same inputs and finishes roughly twice as fast, at a higher per-second price. Switching is a one-line change of `model`. The other Wan 3.0 faces: [`wan3.0-image-to-video`](../wan3.0-image-to-video/README.md) · [`wan3.0-ref-to-video`](../wan3.0-ref-to-video/README.md).

<br>

## Result

`GET https://kinovi.ai/api/v1/jobs/recordInfo?taskId=task_…`

Poll every few seconds until `status` is `success` or `fail`. A 5-second `720p` clip usually takes about 3 minutes. Longer clips and `1080p` take longer; poll for at least 15 minutes before treating a task as stuck.

```json
{
  "taskId": "task_rrbtuejrp14ryrtyc5ufsznp",
  "model": "wan3.0-text-to-video",
  "status": "success",
  "creditsUsed": 99.80000000000001,
  "output": [
    {
      "url": "https://static.kinovi.ai/videos/wan3_1790101319133_19bca07f.mp4",
      "width": 1280,
      "height": 720,
      "mediaType": "video/mp4"
    }
  ],
  "error": null,
  "createTime": 1790101153236,
  "completeTime": 1790101324578
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
| `output[0].width` | `integer` | Pixel width, set by `aspectRatio` × `outputResolution`: at `720p`, `16:9` is 1280×720 and `9:16` is 720×1280; at `480p`, `16:9` is 854×480, `9:16` is 480×854 and `1:1` is 640×640. |
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
| `500` | `Wan 3.0 generation failed: ServiceUnavailable - <503> InternalError.Algo: Service is temporarily unavailable. Please try again later.` | Temporary capacity problem. Retry after a short delay. |

</details>

<br>

## Pricing

Priced **per second of video**, by `outputResolution`. `duration` × the rate is charged at submit; failed tasks are refunded in full. Live prices: [kinovi.ai/models/wan3-text-to-video](https://kinovi.ai/models/wan3-text-to-video).

| | 480p | 720p | 1080p |
|:--|--:|--:|--:|
| **per second** | $0.0663 · 14.26 cr | $0.1326 · 28.51 cr | $0.2651 · 57.01 cr |

Through September 23, 2026, Wan 3.0 is 30% off — per second: 480p $0.0464 · 9.98 cr, 720p $0.0928 · 19.96 cr, 1080p $0.1856 · 39.91 cr.

Example: the `text-to-video` script generates 5 s at `720p` — **142.57 credits · $0.66** at list price (99.8 credits · $0.46 during the discount).

<br>

<p align="center">
  <a href="../../README.md">← All models</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/models/wan3-text-to-video">Model page</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/app/gallery?model=wan3.0-text-to-video">Playground</a>
</p>
