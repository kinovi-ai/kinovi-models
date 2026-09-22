<h1 align="center">Seedream 5.0 Pro</h1>

<p align="center">
  ByteDance's image model on the Kinovi API. Text to image, or edit existing images with up to 10 references.<br>
  Strong at controlled edits, layouts, and multilingual in-image text. Output tops out at 2K.
</p>

<p align="center">
  <img alt="Model id" src="https://img.shields.io/badge/model-seedream--5.0--pro-6366f1?style=flat-square">
  <img alt="Type" src="https://img.shields.io/badge/type-image-0ea5e9?style=flat-square">
  <img alt="From" src="https://img.shields.io/badge/from-%240.0659%20%2F%20image-22c55e?style=flat-square">
  <a href="https://kinovi.ai/models/seedream-5-pro"><img alt="Model page" src="https://img.shields.io/badge/kinovi.ai-model%20page-111827?style=flat-square"></a>
</p>
<p align="center">
  <a href="https://kinovi.ai/app/gallery?model=seedream-5.0-pro"><b>Playground</b></a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/docs/models/seedream-5.0-pro"><b>Docs</b></a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/app/api-keys"><b>Get an API key</b></a>
</p>

**Contents**

- [Run an example](#run-an-example)
- [Request](#request)
  - [Full request](#full-request)
  - [Reference images](#reference-images)
- [Result](#result)
  - [Output fields](#output-fields)
- [Pricing](#pricing) — from $0.0659 / image

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
  "model": "seedream-5.0-pro",
  "inputs": {
    "prompt": "A photorealistic close-up of a steaming cup of coffee on a wooden table, morning sunlight streaming through a window, shallow depth of field.",
    "aspectRatio": "1:1",
    "resolution": "1k",
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
| `402` | `{ "message": "Insufficient credits", "required": 14, "available": 0 }` | Not enough credits for this resolution. |
| `429` | `{ "message": "Concurrency limit reached (…)", "limit": 5, "current": 5 }` | Too many tasks in progress; wait for one to finish. |

</details>

| Field | Type | Default | Description |
|:--|:--|:--|:--|
| `model` | `string` | **required** | Must be `"seedream-5.0-pro"`. |
| `inputs.prompt` | `string` | **required** | What to generate, or how to edit the reference image. Max 10,000 characters. |
| `inputs.uploadedUrls` | `string[]` | – | Up to 10 publicly reachable reference image URLs. Omit for pure text-to-image. |
| `inputs.aspectRatio` | `string` | `auto` | `auto` · `1:1` · `4:3` · `3:4` · `16:9` · `9:16` · `3:2` · `2:3` · `21:9`. `auto` keeps the reference image's aspect ratio when one is given; the output size still follows `resolution`, not the source resolution. |
| `inputs.resolution` | `string` | `2k` | `1k` · `2k`. Examples use `1k`, the cheaper tier. |
| `inputs.outputFormat` | `string` | `png` | `png` · `jpeg` |
| `callBackUrl` | `string` | – | Optional webhook called when the task finishes. |

### Full request

Only `model` and `inputs.prompt` are required; the other fields are shown at their defaults. Drop `uploadedUrls` for text-to-image.

<details>
<summary>All fields</summary>

```json
{
  "model": "seedream-5.0-pro",
  "inputs": {
    "prompt": "A photorealistic close-up of a steaming cup of coffee on a wooden table, morning sunlight streaming through a window, shallow depth of field.",
    "uploadedUrls": [
      "https://static.kinovi.ai/generated-images/task_ff01ii3zvib7ndbx8negnh6q-0.png"
    ],
    "aspectRatio": "auto",
    "resolution": "2k",
    "outputFormat": "png"
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

Poll every couple of seconds until `status` is `success` or `fail`. A 1K image usually finishes in 30–90 seconds.

```json
{
  "taskId": "task_d5ibgnwdlw8fe3zpptx9mp0f",
  "model": "seedream-5.0-pro",
  "status": "success",
  "creditsUsed": 14,
  "output": [
    {
      "url": "https://static.kinovi.ai/generated-images/2026-09-10/seedream_5_pro_1789011790741_0.png",
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

`output` has one item. `width` / `height` follow `aspectRatio` × `resolution`; with `aspectRatio: "auto"` and a reference, the ratio follows the reference while the size still follows `resolution`.

| Field | Type | Description |
|:--|:--|:--|
| `output[].url` | `string` | Download URL of the generated file. Stored by Kinovi; not subject to the 24-hour rule that applies to uploads. |
| `output[].width` | `integer` | Pixel width of the file. |
| `output[].height` | `integer` | Pixel height of the file. |
| `output[].mediaType` | `string` | `image/png` or `image/jpeg`, following `outputFormat`. |

<br>

## Pricing

Price is set by `resolution`. Both examples use `1k` ($0.0659 · 14 credits). Live prices: [kinovi.ai/models/seedream-5-pro](https://kinovi.ai/models/seedream-5-pro).

| | 1K | 2K |
|:--|--:|--:|
| **per image** | $0.0659 · 14 cr | $0.1130 · 24 cr |

<br>

<p align="center">
  <a href="../../README.md">← All models</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/models/seedream-5-pro">Model page</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/app/gallery?model=seedream-5.0-pro">Playground</a>
</p>
