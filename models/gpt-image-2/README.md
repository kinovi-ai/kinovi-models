<h1 align="center">GPT Image 2</h1>

<p align="center">
  OpenAI's image model on the Kinovi API. Text to image, or edit and restyle existing images with up to 10 references.<br>
  Strong at photorealism, accurate in-image text, and multi-element compositions.
</p>

<p align="center">
  <img alt="Model id" src="https://img.shields.io/badge/model-gpt--image--2-6366f1?style=flat-square">
  <img alt="Type" src="https://img.shields.io/badge/type-image-0ea5e9?style=flat-square">
  <img alt="From" src="https://img.shields.io/badge/from-%240.01%20%2F%20image-22c55e?style=flat-square">
  <a href="https://kinovi.ai/models/gpt-image-2"><img alt="Model page" src="https://img.shields.io/badge/kinovi.ai-model%20page-111827?style=flat-square"></a>
</p>

> Try it in the [Playground](https://kinovi.ai/app/gallery?model=gpt-image-2) · Full reference at [kinovi.ai/docs/models/gpt-image-2](https://kinovi.ai/docs/models/gpt-image-2) · Get an [API key](https://kinovi.ai/app/api-keys)

<br>

## Run an example

```bash
# Put KINOVI_API_KEY in ../../.env, or:
export KINOVI_API_KEY=your-api-key   # https://kinovi.ai/app/api-keys

python3 text-to-image.py             # Python 3.8+, stdlib only
npx tsx text-to-image.ts             # Node.js 18+, no dependencies
bash text-to-image.sh                # curl only
```

Each script submits a task, polls until it finishes, and saves the image next to the script. Edit the `INPUTS` block at the top to change the prompt or options.

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
      <td><b>Text to image</b></td>
      <td>Generate a 1K square image from a prompt</td>
      <td><a href="./text-to-image.py"><code>.py</code></a></td>
      <td><a href="./text-to-image.ts"><code>.ts</code></a></td>
      <td><a href="./text-to-image.sh"><code>.sh</code></a></td>
    </tr>
    <tr>
      <td><b>Image to image</b></td>
      <td>Restyle an existing image via <code>uploadedUrls</code></td>
      <td><a href="./image-to-image.py"><code>.py</code></a></td>
      <td><a href="./image-to-image.ts"><code>.ts</code></a></td>
      <td><a href="./image-to-image.sh"><code>.sh</code></a></td>
    </tr>
  </tbody>
</table>

<br>

## Request

`POST https://kinovi.ai/api/v1/jobs/createTask`

```json
{
  "model": "gpt-image-2",
  "inputs": {
    "prompt": "A photorealistic close-up of a steaming cup of coffee on a wooden table, morning sunlight streaming through a window, shallow depth of field.",
    "aspectRatio": "1:1",
    "resolution": "1k",
    "quality": "low",
    "outputFormat": "png"
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
| `400` | `{ "message": "Invalid inputs for model", "errors": [ … ] }` | A field is missing or has an unsupported value; `errors` lists each one. |
| `401` | `{ "message": "Invalid API Key" }` | Missing or wrong `Authorization` header. |
| `402` | `{ "message": "Insufficient credits", "required": 2.17, "available": 0 }` | Not enough credits for this quality × resolution. |
| `429` | `{ "message": "Concurrency limit reached (…)", "limit": 5, "current": 5 }` | Too many tasks in progress; wait for one to finish. |

</details>

| Field | Type | Default | Description |
|:--|:--|:--|:--|
| `model` | `string` | **required** | Must be `"gpt-image-2"`. |
| `inputs.prompt` | `string` | **required** | What to generate, or how to edit the reference image. |
| `inputs.uploadedUrls` | `string[]` | – | Up to 10 publicly reachable reference image URLs. Omit for pure text-to-image. |
| `inputs.aspectRatio` | `string` | `auto` | `auto` · `1:1` · `4:3` · `3:4` · `16:9` · `9:16`. `auto` follows the reference image when given. |
| `inputs.resolution` | `string` | `1k` | `1k` · `2k` · `4k` |
| `inputs.quality` | `string` | `low` | `low` · `medium` · `high`. With `resolution`, sets the price. |
| `inputs.outputFormat` | `string` | `png` | `png` · `jpeg` |
| `inputs.background` | `string` | `auto` | `auto` · `opaque` |
| `callBackUrl` | `string` | – | Optional webhook called when the task finishes. |

### Full request

Only `model` and `inputs.prompt` are required; every other field is shown at its default. Drop `uploadedUrls` for text-to-image.

<details>
<summary>All fields</summary>

```json
{
  "model": "gpt-image-2",
  "inputs": {
    "prompt": "A photorealistic close-up of a steaming cup of coffee on a wooden table, morning sunlight streaming through a window, shallow depth of field.",
    "uploadedUrls": [
      "https://static.kinovi.ai/generated-images/task_ff01ii3zvib7ndbx8negnh6q-0.png"
    ],
    "aspectRatio": "auto",
    "resolution": "1k",
    "quality": "low",
    "outputFormat": "png",
    "background": "auto"
  },
  "callBackUrl": "https://example.com/hooks/kinovi"
}
```

</details>

### Reference images

`inputs.uploadedUrls` takes up to **10** image URLs. Each must be a URL the generation backend can fetch at request time — a public CDN, object storage, or a Kinovi upload. Localhost, private networks and URLs that need a login do not work. For files on your own machine, upload them first ([docs: Uploading assets](https://kinovi.ai/docs/uploads)): `POST /api/v1/uploads` returns an `uploadUrl` to `PUT` the bytes to and the public `url` to pass here; uploads are kept for 24 hours.

<br>

## Result

`GET https://kinovi.ai/api/v1/jobs/recordInfo?taskId=task_…`

Poll every couple of seconds until `status` is `success` or `fail`. A 1K image usually finishes in 20–40 seconds.

```json
{
  "taskId": "task_d5ibgnwdlw8fe3zpptx9mp0f",
  "model": "gpt-image-2",
  "status": "success",
  "creditsUsed": 2.17,
  "output": [
    {
      "url": "https://static.kinovi.ai/generated-images/2026-09-10/gpt_image_2_1789005123161_0.png",
      "width": 1024,
      "height": 1024,
      "mediaType": "image/png"
    }
  ],
  "error": null,
  "createTime": 1789005095581,
  "completeTime": 1789005126039
}
```

| `status` | Meaning |
|:--|:--|
| `waiting` | Queued, not started yet |
| `generating` | Running |
| `success` | Done — read `output[].url` |
| `fail` | Failed — see `error.code` / `error.message`; credits are refunded |

### Output fields

`output` has one item. `width` / `height` follow `aspectRatio` × `resolution`; with `aspectRatio: "auto"` and a reference, they follow the reference.

| Field | Type | Description |
|:--|:--|:--|
| `output[].url` | `string` | Download URL of the generated file. Stored by Kinovi; not subject to the 24-hour rule that applies to uploads. |
| `output[].width` | `integer` | Pixel width of the file. |
| `output[].height` | `integer` | Pixel height of the file. |
| `output[].mediaType` | `string` | `image/png` or `image/jpeg`, following `outputFormat`. |

<br>

## Pricing

Price is set by `quality` × `resolution`. Both examples use `low` / `1k` ($0.010 · 2.17 credits). Live prices: [kinovi.ai/models/gpt-image-2](https://kinovi.ai/models/gpt-image-2).

| | 1K | 2K | 4K |
|:--|--:|--:|--:|
| **low** | $0.010 · 2.17 cr | $0.020 · 4.34 cr | $0.030 · 6.52 cr |
| **medium** | $0.060 · 13.03 cr | $0.100 · 21.72 cr | $0.180 · 39.09 cr |
| **high** | $0.220 · 47.78 cr | $0.400 · 86.87 cr | $0.720 · 156.36 cr |

<br>

<p align="center">
  <a href="../../README.md">← All models</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/models/gpt-image-2">Model page</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/app/gallery?model=gpt-image-2">Playground</a>
</p>
