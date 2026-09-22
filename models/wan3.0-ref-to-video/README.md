<h1 align="center">Wan 3.0 Reference-to-Video</h1>

<p align="center">
  Alibaba's Wan 3.0 reference-to-video on the Kinovi API. Build a shot from up to 10 reference images, 5 reference videos and 5 audio clips, cited in the prompt as <code>@Image1</code>, <code>@Video1</code>, <code>@Audio1</code>.<br>
  2–30 second clips with a generated audio track, 480p to 1080p.
</p>

<p align="center">
  <img alt="Model id" src="https://img.shields.io/badge/model-wan3.0--ref--to--video-6366f1?style=flat-square">
  <img alt="Type" src="https://img.shields.io/badge/type-video-0ea5e9?style=flat-square">
  <img alt="From" src="https://img.shields.io/badge/from-%240.0663%20%2F%20s-22c55e?style=flat-square">
  <a href="https://kinovi.ai/models/wan3-ref-to-video"><img alt="Model page" src="https://img.shields.io/badge/kinovi.ai-model%20page-111827?style=flat-square"></a>
</p>

> Try it in the [Playground](https://kinovi.ai/app/gallery?model=wan3.0-ref-to-video) · Full reference at [kinovi.ai/docs/models/wan3.0-ref-to-video](https://kinovi.ai/docs/models/wan3.0-ref-to-video) · Get an [API key](https://kinovi.ai/app/api-keys)

<br>

## Run an example

```bash
# Put KINOVI_API_KEY in ../../.env, or:
export KINOVI_API_KEY=your-api-key   # https://kinovi.ai/app/api-keys

python3 omni-reference-to-video.py   # Python 3.8+, stdlib only
npx tsx omni-reference-to-video.ts   # Node.js 18+, no dependencies
bash omni-reference-to-video.sh      # curl only
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
      <td><b>Omni reference</b></td>
      <td>Build a shot from 3 reference images cited as <code>@Image1</code>–<code>@Image3</code></td>
      <td><a href="./omni-reference-to-video.py"><code>.py</code></a></td>
      <td><a href="./omni-reference-to-video.ts"><code>.ts</code></a></td>
      <td><a href="./omni-reference-to-video.sh"><code>.sh</code></a></td>
    </tr>
    <tr>
      <td><b>Reference to video</b></td>
      <td>Borrow the motion and framing of a clip in <code>videoUrls</code> (<code>@Video1</code>)</td>
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
  "model": "wan3.0-ref-to-video",
  "inputs": {
    "prompt": "A barista sets the coffee cup from @Image1 down on the sunlit wooden table from @Image2, steam curling up, slow dolly-in, warm morning light in the style of @Image3.",
    "imageUrls": [
      "https://static.kinovi.ai/generated-images/2026-09-10/gpt_image_2_1789005123161_0.png",
      "https://static.kinovi.ai/generated-images/2026-09-10/nanobanana_pro_1789012003511.png",
      "https://static.kinovi.ai/generated-images/2026-09-10/seedream_5_pro_1789011790741_0.png"
    ],
    "aspectRatio": "16:9",
    "duration": 5,
    "outputResolution": "720p"
  }
}
```

Response `200 OK` — the task is queued and credits are reserved. Use `taskId` to poll for the result.

```json
{
  "taskId": "task_zgz78l3nhd1xg3hera4a02fg"
}
```

<details>
<summary>Error responses</summary>

| HTTP | Body | When |
|:--|:--|:--|
| `400` | `{ "message": "Invalid inputs for model", "errors": [ … ] }` | A field has the wrong type or an unsupported value, for example more than 10 `imageUrls` or 5 `videoUrls`, or `duration` outside 2–30. `errors` lists each problem with its `path`. Nothing is charged. |
| `400` | `{ "message": "Unknown model" }` | `model` is not a Kinovi model id. |
| `400` | `{ "message": "Invalid request parameters" }` | The request body itself is malformed, for example `callBackUrl` is not a URL. |
| `401` | `{ "message": "Invalid API Key" }` | Missing or wrong `Authorization` header. |
| `402` | `{ "message": "Insufficient credits", "required": 142.57, "available": 0 }` | Not enough credits for this duration × resolution. |
| `429` | `{ "message": "Concurrency limit reached (…)", "limit": 5, "current": 5 }` | Too many tasks in progress; wait for one to finish. |

</details>

| Field | Type | Default | Description |
|:--|:--|:--|:--|
| `model` | `string` | **required** | Must be `"wan3.0-ref-to-video"`. |
| `inputs.prompt` | `string` | **required** | What should happen in the video, in any language. Cite references by position: `@Image1`, `@Video1`, `@Audio1`. Max **20,000** characters. |
| `inputs.imageUrls` | `string[]` | – | Up to **10** reference image URLs (`.jpg` / `.png` / `.webp`) for subjects, places or style. See [Reference media](#reference-media). |
| `inputs.videoUrls` | `string[]` | – | Up to **5** reference video URLs (`.mp4` / `.mov`), each at most **15 s**. The clip's motion and framing guide the output. Reference length plus `duration` must stay within **30 s**. |
| `inputs.audioUrls` | `string[]` | – | Up to **5** reference audio URLs (`.mp3` / `.wav` / `.m4a` / `.ogg`), **15 s** combined. |
| `inputs.aspectRatio` | `string` | `16:9` | `16:9` · `9:16` · `4:3` · `3:4` · `1:1`. |
| `inputs.duration` | `integer` | `5` | Clip length in seconds, an integer from `2` to `30`. |
| `inputs.outputResolution` | `string` | `720p` | `480p` · `720p` · `1080p`. |
| `inputs.audio` | `boolean` | `true` | Generate an audio track with the video. Set `false` for a silent clip. |
| `inputs.seed` | `integer` | random | `0`–`2147483647`. Omit for a random seed. |
| `callBackUrl` | `string` | – | Optional webhook called when the task finishes. |

### Full request

Only `model` and `inputs.prompt` are required; the other fields are shown at their defaults or typical values. Add `videoUrls` / `audioUrls` entries to use clip or audio references.

<details>
<summary>All fields</summary>

```json
{
  "model": "wan3.0-ref-to-video",
  "inputs": {
    "prompt": "A barista sets the coffee cup from @Image1 down on the sunlit wooden table from @Image2, steam curling up, slow dolly-in, warm morning light in the style of @Image3.",
    "imageUrls": [
      "https://static.kinovi.ai/generated-images/2026-09-10/gpt_image_2_1789005123161_0.png",
      "https://static.kinovi.ai/generated-images/2026-09-10/nanobanana_pro_1789012003511.png",
      "https://static.kinovi.ai/generated-images/2026-09-10/seedream_5_pro_1789011790741_0.png"
    ],
    "videoUrls": [],
    "audioUrls": [],
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

### Reference media

| You send | Result |
|:--|:--|
| `imageUrls` | Subjects, props, places or style to reuse. Say what each one is for: *"the cup from @Image1 on the table from @Image2"*. |
| `videoUrls` | The clip's motion, camera move and framing guide the output; describe the new subject or look in the prompt. |
| `audioUrls` | A soundtrack or voice to build the clip around. |

References are numbered per type in the order you send them: `@Image1` is `imageUrls[0]`, `@Video1` is `videoUrls[0]`, `@Audio1` is `audioUrls[0]`. Types can be mixed in one task within the limits in the field table.

Every URL must be publicly reachable **by the generation backend**, not just from your machine. For local files, upload them first — see [kinovi.ai/docs/uploads](https://kinovi.ai/docs/uploads); uploaded files are kept for 24 hours. Images can be up to 8000×8000; very small images are rejected. Media that cannot be downloaded or decoded, or that appears to show a real person's face, ends the task in `fail` — see [Error codes](#error-codes).

### Standard and Prime

Wan 3.0 has three faces — text-to-video, image-to-video and reference-to-video — each in a standard and a Prime tier. [`wan3.0-prime-ref-to-video`](../wan3.0-prime-ref-to-video/README.md) takes the same inputs and finishes roughly twice as fast, at a higher per-second price. Switching is a one-line change of `model`. The other Wan 3.0 faces: [`wan3.0-text-to-video`](../wan3.0-text-to-video/README.md) · [`wan3.0-image-to-video`](../wan3.0-image-to-video/README.md).

<br>

## Result

`GET https://kinovi.ai/api/v1/jobs/recordInfo?taskId=task_…`

Poll every few seconds until `status` is `success` or `fail`. A 5-second `720p` clip usually takes 3–4 minutes from images, and up to about 6 minutes with a reference video. Longer clips and `1080p` take longer; poll for at least 15 minutes before treating a task as stuck.

```json
{
  "taskId": "task_zgz78l3nhd1xg3hera4a02fg",
  "model": "wan3.0-ref-to-video",
  "status": "success",
  "creditsUsed": 99.80000000000001,
  "output": [
    {
      "url": "https://static.kinovi.ai/videos/wan3_1790101353644_572f1d97.mp4",
      "width": 1280,
      "height": 720,
      "mediaType": "video/mp4"
    }
  ],
  "error": null,
  "createTime": 1790101159105,
  "completeTime": 1790101356996
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
| `output[0].width` | `integer` | Pixel width, set by `aspectRatio` × `outputResolution`: 1280×720 for `16:9` and 720×1280 for `9:16` at `720p`. |
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
| `InvalidParameter` | `Wan 3.0 generation failed: InvalidParameter - <video URL> duration should be at most 15s, got 16.12s` | A reference video is longer than 15 s. Trim it. |
| `InvalidParameter` | `Wan 3.0 generation failed: InvalidParameter - input_video_duration(10.61s) + duration(20.0s) = 30.61s exceeds 30s limit` | Reference video length plus `duration` is over 30 s. Shorten the reference or lower `duration`. |
| `InvalidParameter` | `Reference audio total duration exceeds the limit. Please use audio with a combined duration of 15 seconds or less.` | `audioUrls` add up to more than 15 s. Trim or drop a clip. |
| `500` | `Wan 3.0 generation failed: ServiceUnavailable - <503> InternalError.Algo: Service is temporarily unavailable. Please try again later.` | Temporary capacity problem. Retry after a short delay. |

</details>

<br>

## Pricing

Priced **per second of video**, by `outputResolution`. Reference images, videos and audio do not change the price; only the output length counts. `duration` × the rate is charged at submit; failed tasks are refunded in full. Live prices: [kinovi.ai/models/wan3-ref-to-video](https://kinovi.ai/models/wan3-ref-to-video).

| | 480p | 720p | 1080p |
|:--|--:|--:|--:|
| **per second** | $0.0663 · 14.26 cr | $0.1326 · 28.51 cr | $0.2651 · 57.01 cr |

Through September 23, 2026, Wan 3.0 is 30% off — per second: 480p $0.0464 · 9.98 cr, 720p $0.0928 · 19.96 cr, 1080p $0.1856 · 39.91 cr.

Example: the `omni-reference-to-video` and `reference-to-video` scripts generate 5 s at `720p` — **142.57 credits · $0.66** at list price (99.8 credits · $0.46 during the discount).

<br>

<p align="center">
  <a href="../../README.md">← All models</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/models/wan3-ref-to-video">Model page</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/app/gallery?model=wan3.0-ref-to-video">Playground</a>
</p>
