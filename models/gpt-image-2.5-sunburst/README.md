<h1 align="center">GPT Image 2.5 Sunburst</h1>

<p align="center">
  OpenAI GPT Image 2.5 Sunburst on the Kinovi API. Text to image, or edit with up to 16 reference images.<br>
  Five quality tiers up to Max, 1K–4K output, PNG or JPEG, and usage-based token billing.
</p>

<p align="center">
  <img alt="Model id" src="https://img.shields.io/badge/model-gpt--image--2.5--sunburst-6366f1?style=flat-square">
  <img alt="Type" src="https://img.shields.io/badge/type-image-0ea5e9?style=flat-square">
  <img alt="From" src="https://img.shields.io/badge/from-%7E%241.75%20%2F%20image%20(estimate)-22c55e?style=flat-square">
  <a href="https://kinovi.ai/models/gpt-image-2.5-sunburst"><img alt="Model page" src="https://img.shields.io/badge/kinovi.ai-model%20page-111827?style=flat-square"></a>
</p>

> Try it in the [Playground](https://kinovi.ai/app/gallery?model=gpt-image-2.5-sunburst) · Full reference at [kinovi.ai/docs/models/gpt-image-2.5-sunburst](https://kinovi.ai/docs/models/gpt-image-2.5-sunburst) · Get an [API key](https://kinovi.ai/api-keys)

<br>

## Run an example

```bash
# Put KINOVI_API_KEY in ../../.env, or:
export KINOVI_API_KEY=your-api-key   # https://kinovi.ai/api-keys

python3 text-to-image.py             # Python 3.8+, stdlib only
npx tsx text-to-image.ts             # Node.js 18+, no dependencies
bash text-to-image.sh                # curl only
```

Each script submits a task, polls until it finishes, and saves the image next to the script. Edit the `INPUTS` block at the top to change the prompt or options.

Optional: point at staging with `export KINOVI_API_BASE=https://dev.kinovi.ai/api/v1` (plus your staging key and any deployment bypass your environment requires).

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
      <td>Generate a 1K image from a prompt (<code>low</code> quality)</td>
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
  "model": "gpt-image-2.5-sunburst",
  "inputs": {
    "prompt": "A clean product render of a matte black coffee mug on a white background.",
    "aspectRatio": "auto",
    "resolution": "1k",
    "quality": "low",
    "outputFormat": "png",
    "background": "auto"
  }
}
```

Response `200 OK` — the task is queued and credits are reserved. Use `taskId` to poll for the result.

```json
{
  "taskId": "task_vmq0zv4nxdola49oz236gdrk"
}
```

<details>
<summary>Error responses</summary>

| HTTP | Body | When |
|:--|:--|:--|
| `400` | `{ "message": "Invalid inputs for model", "errors": [ … ] }` | A field is missing or has an unsupported value; `errors` lists each one. |
| `401` | `{ "message": "Invalid API Key" }` | Missing or wrong `Authorization` header. |
| `402` | `{ "message": "Insufficient credits", "required": 1.75, "available": 0 }` | Not enough credits for the estimated precharge. |
| `429` | `{ "message": "Concurrency limit reached (…)", "limit": 5, "current": 5 }` | Too many tasks in progress; wait for one to finish. |

</details>

| Field | Type | Default | Description |
|:--|:--|:--|:--|
| `model` | `string` | **required** | Must be `"gpt-image-2.5-sunburst"`. |
| `inputs.prompt` | `string` | **required** | What to generate, or how to edit the reference image(s). |
| `inputs.uploadedUrls` | `string[]` | – | Up to **16** publicly reachable reference image URLs. Omit for pure text-to-image. |
| `inputs.aspectRatio` | `string` | `auto` | `auto` · `1:1` · `4:3` · `3:4` · `16:9` · `9:16`. `auto` keeps source ratio when references are given. |
| `inputs.resolution` | `string` | `1k` | `1k` · `2k` · `4k` output pixel tier. |
| `inputs.quality` | `string` | `low` | `low` · `medium` · `high` · `xhigh` · `max`. Higher tiers usually produce more output tokens and cost more. `auto` is also accepted and resolves to the default tier. |
| `inputs.outputFormat` | `string` | `png` | `png` · `jpeg`. WebP is not available on this model. |
| `inputs.background` | `string` | `auto` | `auto` · `transparent` · `opaque`. |
| `inputs.outputCompression` | `integer` | – | `0`–`100` for `jpeg` only. |
| `callBackUrl` | `string` | – | Optional webhook called when the task finishes. |

### Full request

Only `model` and `inputs.prompt` are required; the other fields are shown at their defaults. `outputCompression` only applies with `outputFormat: "jpeg"`. Drop `uploadedUrls` for text-to-image.

<details>
<summary>All fields</summary>

```json
{
  "model": "gpt-image-2.5-sunburst",
  "inputs": {
    "prompt": "A photorealistic close-up of a steaming cup of coffee on a wooden table, morning sunlight streaming through a window, shallow depth of field.",
    "uploadedUrls": [
      "https://static.kinovi.ai/generated-images/task_ff01ii3zvib7ndbx8negnh6q-0.png"
    ],
    "aspectRatio": "auto",
    "resolution": "1k",
    "quality": "low",
    "outputFormat": "png",
    "background": "auto",
    "outputCompression": 80
  },
  "callBackUrl": "https://example.com/hooks/kinovi"
}
```

</details>

### Reference images

`inputs.uploadedUrls` takes up to **16** image URLs. Each must be a URL the generation backend can fetch at request time — a public CDN, object storage, or a Kinovi upload. Localhost, private networks and URLs that need a login do not work. For files on your own machine, upload them first ([docs: Uploading assets](https://kinovi.ai/docs/uploads)): `POST /api/v1/uploads` returns an `uploadUrl` to `PUT` the bytes to and the public `url` to pass here; uploads are kept for 24 hours.

<br>

## Result

`GET https://kinovi.ai/api/v1/jobs/recordInfo?taskId=task_…`

Poll every couple of seconds until `status` is `success` or `fail`. A 1K image usually finishes in 30–90 seconds.

`resolution` is a tier, not an exact size: at `1k` the output follows the requested `aspectRatio` — `1:1` is 1024×1024, `4:3` is 1184×896, `16:9` is 1376×768, and `auto` returns the model's own choice (for example 1356×1159). `2k` / `4k` scale the same way. Always read `output[].width` and `output[].height` instead of assuming a size.

While the job is running, `creditsUsed` shows the **precharge estimate** (for example `1.75` credits for `low` / `1k` text-to-image). After success, Kinovi settles to the actual upstream token usage and refunds or charges the difference.

```json
{
  "taskId": "task_vmq0zv4nxdola49oz236gdrk",
  "model": "gpt-image-2.5-sunburst",
  "status": "success",
  "creditsUsed": 1.82,
  "output": [
    {
      "url": "https://static.kinovi.ai/generated-images/2026-09-12/gpt_image_2_5_sunburst_0.png",
      "width": 1024,
      "height": 1024,
      "mediaType": "image/png"
    }
  ],
  "error": null,
  "createTime": 1789184890843,
  "completeTime": 1789184952104
}
```

| `status` | Meaning |
|:--|:--|
| `waiting` | Queued, not started yet |
| `generating` | Running |
| `success` | Done — read `output[].url` |
| `fail` | Failed — see `error.code` / `error.message`; credits are refunded |

### Output fields

`output` has one item. `resolution` is a tier, so always read `width` / `height` from the response rather than assuming a size.

| Field | Type | Description |
|:--|:--|:--|
| `output[].url` | `string` | Download URL of the generated file. Stored by Kinovi; not subject to the 24-hour rule that applies to uploads. |
| `output[].width` | `integer` | Pixel width of the file. |
| `output[].height` | `integer` | Pixel height of the file. |
| `output[].mediaType` | `string` | `image/png` or `image/jpeg`, following `outputFormat`. |

<br>

## Pricing

GPT Image 2.5 uses **usage-based token billing**, not a fixed price per image.

1. **Submit** — Kinovi precharges a conservative estimate from your prompt, reference count, `quality`, and `resolution` (for example **~1.75 credits** for `low` / `1k` text-to-image with no references).
2. **Success** — the order settles to actual upstream token usage (`text` / `cached text` / `image input` / `cached image input` / `image output`).
3. **Difference** — any over-precharge is refunded; under-precharge is topped up.

Approximate Kinovi rates (credits per 1,000 tokens):

| Category | Credits / 1k tokens |
|:--|--:|
| Text input | 1.30 |
| Cached text input | 0.33 |
| Image input | 2.08 |
| Cached image input | 0.52 |
| Image output | 7.82 |

Higher **quality** and **resolution** usually mean more output tokens, so they cost more on average. Live estimates: [kinovi.ai/models/gpt-image-2.5-sunburst](https://kinovi.ai/models/gpt-image-2.5-sunburst).

<br>

## Sunburst vs Flare

Both faces share the same `inputs` schema and token pricing. **Sunburst** targets maximum quality; **[Flare](../gpt-image-2.5-flare)** is tuned for faster iteration with the same API fields.

<br>

<p align="center">
  <a href="../../README.md">← All models</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/models/gpt-image-2.5-sunburst">Model page</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/app/gallery?model=gpt-image-2.5-sunburst">Playground</a>
</p>
