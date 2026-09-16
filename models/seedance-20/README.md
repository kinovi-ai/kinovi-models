<h1 align="center">Seedance 2.0</h1>

<p align="center">
  ByteDance's video model on the Kinovi API. Text to video, image to video (single frame or first/last keyframes), or reference-driven generation from up to 9 images, 3 videos and 3 audio clips.<br>
  4–15 second clips with a generated audio track, 480p to native 4K.
</p>

<p align="center">
  <img alt="Model id" src="https://img.shields.io/badge/model-seedance--20-6366f1?style=flat-square">
  <img alt="Type" src="https://img.shields.io/badge/type-video-0ea5e9?style=flat-square">
  <img alt="From" src="https://img.shields.io/badge/from-%240.0707%20%2F%20s-22c55e?style=flat-square">
  <a href="https://kinovi.ai/models/seedance-20"><img alt="Model page" src="https://img.shields.io/badge/kinovi.ai-model%20page-111827?style=flat-square"></a>
</p>

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
      <td><b>Reference to video</b></td>
      <td>Reuse the motion of a reference clip in <code>videoUrls</code></td>
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
  "model": "seedance-20",
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
| `400` | `{ "message": "Invalid inputs for model", "errors": [ … ] }` | A field is missing or has an unsupported value (for example `duration` outside 4–15); `errors` lists each one. |
| `401` | `{ "message": "Invalid API Key" }` | Missing or wrong `Authorization` header. |
| `402` | `{ "message": "Insufficient credits", "required": 200, "available": 0 }` | Not enough credits for this duration × resolution. |
| `429` | `{ "message": "Concurrency limit reached (…)", "limit": 5, "current": 5 }` | Too many tasks in progress; wait for one to finish. |

</details>

| Field | Type | Default | Description |
|:--|:--|:--|:--|
| `model` | `string` | **required** | Must be `"seedance-20"`. |
| `inputs.prompt` | `string` | **required** | What should happen in the video, in any language. Max 10,000 characters. |
| `inputs.imageUrls` | `string[]` | – | Up to **9** publicly reachable image URLs (`.jpg` / `.png` / `.webp`). In `keyframe` mode, 1 image is the opening frame and 2 images are first and last frame. In `reference` mode all images are subject/style references. |
| `inputs.videoUrls` | `string[]` | – | Up to **3** reference video URLs (`.mp4` / `.mov` / `.webm`), **15 s combined** across all videos. Any video switches the task to `reference` mode and to the reference-video price tier. |
| `inputs.audioUrls` | `string[]` | – | Up to **3** audio URLs (`.mp3` / `.wav` / `.m4a` / `.aac` / `.ogg` / `.flac`), **15 s combined** across all clips. Any audio switches the task to `reference` mode. |
| `inputs.mode` | `string` | `keyframe` | `keyframe` · `reference`. `keyframe` animates 1–2 images as opening / closing frames. `reference` treats up to 9 images as subject / style references and is always used when `videoUrls` or `audioUrls` are given. |
| `inputs.duration` | `integer` | `5` | Clip length in seconds, `4`–`15`. Billing is per second. |
| `inputs.outputResolution` | `string` | `720p` | `480p` · `720p` · `1080p` · `4k`. Sets the price tier. |
| `inputs.aspectRatio` | `string` | see description | `16:9` · `9:16` · `1:1` · `4:3` · `3:4` · `21:9`. Defaults to `16:9` for text-to-video. When any image, video or audio is given and `aspectRatio` is omitted, the output follows the reference media's ratio. |
| `inputs.generate_audio` | `boolean` | `true` | Generate a synced audio track. Set `false` for a silent video. |
| `inputs.bitrate_mode` | `string` | – | Set to `"high"` for a higher-bitrate encode. Omit for the standard bitrate. |
| `inputs.seed` | `integer` | random | `0`–`4294967295` for reproducible output, or `-1` for random. |
| `callBackUrl` | `string` | – | Optional webhook called when the task finishes. |

### Reference media

| You send | Mode | Result |
|:--|:--|:--|
| `prompt` only | text-to-video | Scene generated from scratch. `aspectRatio` defaults to `16:9`. |
| 1 image | `keyframe` | The image becomes the opening frame and is animated. |
| 2 images | `keyframe` | First image is the opening frame, second is the closing frame. |
| Up to 9 images + `"mode": "reference"` | `reference` | Images are subject / style references; the prompt describes the shot. |
| `videoUrls` and/or `audioUrls` | `reference` | Motion, camera work, or audio is borrowed from the references. |

When media is given and `aspectRatio` is omitted, the output follows the reference; set it explicitly to force a different frame. Files must be publicly reachable at request time. To use local files, upload them first via `POST /api/v1/uploads` and pass the returned URLs.

<br>

## Result

`GET https://kinovi.ai/api/v1/jobs/recordInfo?taskId=task_…`

Poll every couple of seconds until `status` is `success` or `fail`. Video generation takes a few minutes; longer clips, 1080p and 4K take longer than a 5-second 720p clip.

`output[0].url` is an `.mp4` with the generated audio track (unless `generate_audio` is `false`). `width` / `height` follow the effective aspect ratio and `outputResolution` — a `16:9` clip at `720p` is 1280×720.

```json
{
  "taskId": "task_d5ibgnwdlw8fe3zpptx9mp0f",
  "model": "seedance-20",
  "status": "success",
  "creditsUsed": 200,
  "output": [
    {
      "url": "https://static.seedance2-pro.com/videos/seedance_video_1789011790741_17cd129c.mp4",
      "width": 1280,
      "height": 720,
      "mediaType": "video/mp4"
    }
  ],
  "error": null,
  "createTime": 1789005095581,
  "completeTime": 1789005226039
}
```

| `status` | Meaning |
|:--|:--|
| `waiting` | Queued, not started yet |
| `generating` | Running |
| `success` | Done — read `output[].url` |
| `fail` | Failed — see `error.code` / `error.message`; credits are refunded |

<br>

## Pricing

Priced **per second of video**, by `outputResolution`. Attaching a reference video (`videoUrls`) moves the task to that resolution's reference tier. Reference images and audio do not change the price. The full `duration` is charged at submit and is the final price; failed tasks are refunded in full. Live prices: [kinovi.ai/models/seedance-20](https://kinovi.ai/models/seedance-20).

| | 480p | 720p | 1080p | 4K |
|:--|--:|--:|--:|--:|
| **per second** | $0.0707 · 15 cr | $0.1884 · 40 cr | $0.4239 · 90 cr | $0.9420 · 200 cr |
| **per second, with reference video** | $0.0895 · 19 cr | $0.2261 · 48 cr | $0.5087 · 108 cr | $1.1305 · 240 cr |

Examples: the text-to-video and image-to-video scripts generate 5 s at `720p` (**200 credits · $0.94**); the reference-to-video script also uses 5 s at `720p` but includes a reference video (**240 credits · $1.13**).

<br>

<p align="center">
  <a href="../../README.md">← All models</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/models/seedance-20">Model page</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/app/gallery?model=seedance-20">Playground</a>
</p>
