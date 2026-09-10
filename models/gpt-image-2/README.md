<p align="center">
  <a href="https://kinovi.ai/models/gpt-image-2">
    <img src="https://static.seedance2-pro.com/generated-images/2026-07-26/gpt_image_2_1785074981697_0.png" alt="Generated with GPT Image 2 on Kinovi" width="560">
  </a>
</p>

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

<br>

## Run an example

```bash
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
      <td><b>Image reference</b></td>
      <td>Restyle an existing image via <code>uploadedUrls</code></td>
      <td><a href="./image-reference.py"><code>.py</code></a></td>
      <td><a href="./image-reference.ts"><code>.ts</code></a></td>
      <td><a href="./image-reference.sh"><code>.sh</code></a></td>
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
    "prompt": "A photorealistic close-up of a steaming cup of coffee on a wooden table.",
    "aspectRatio": "1:1",
    "resolution": "1k",
    "quality": "low",
    "outputFormat": "png"
  }
}
```

Returns `{ "taskId": "task_…" }`.

| Field | Type | Default | Description |
|:--|:--|:--|:--|
| `inputs.prompt` | `string` | **required** | What to generate, or how to edit the reference image. |
| `inputs.uploadedUrls` | `string[]` | – | Up to 10 publicly reachable reference image URLs. Omit for pure text-to-image. |
| `inputs.aspectRatio` | `string` | `auto` | `auto` · `1:1` · `4:3` · `3:4` · `16:9` · `9:16`. `auto` follows the reference image when given. |
| `inputs.resolution` | `string` | `1k` | `1k` · `2k` · `4k` |
| `inputs.quality` | `string` | `low` | `low` · `medium` · `high`. With `resolution`, sets the price. |
| `inputs.outputFormat` | `string` | `png` | `png` · `jpeg` · `webp` |
| `inputs.background` | `string` | `auto` | `auto` · `opaque` |
| `callBackUrl` | `string` | – | Optional webhook called when the task finishes. |

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
      "url": "https://static.seedance2-pro.com/generated-images/2026-09-10/gpt_image_2_1789005123161_0.png",
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

<br>

## Pricing

Price is set by `quality` × `resolution`. Both examples default to `low` / `1k`, the cheapest tier. Live prices: [kinovi.ai/models/gpt-image-2](https://kinovi.ai/models/gpt-image-2).

| | 1K | 2K | 4K |
|:--|--:|--:|--:|
| **low** | $0.010 | $0.020 | $0.030 |
| **medium** | $0.060 | $0.100 | $0.180 |
| **high** | $0.220 | $0.400 | $0.720 |

<br>

## Tips

- Write the scene as plain sentences. GPT Image 2 handles long, natural prompts well.
- For text inside the image, quote it exactly: *a neon sign that reads "OPEN LATE"*.
- With references, say what to keep and what to change: *keep the pose and outfit, change the background to a rainy street*.
- Iterate at `low` / `1k`, then rerun the final prompt at `high` / `2k` or `4k`.

<br>

<p align="center">
  <a href="../../README.md">← All models</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/models/gpt-image-2">Model page</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/app/gallery?model=gpt-image-2">Playground</a>
</p>
