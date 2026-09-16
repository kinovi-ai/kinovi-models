<h1 align="center">NanoBanana 2</h1>

<p align="center">
  Google Gemini image model on the Kinovi API. Text to image, or edit and composite with reference images.<br>
  Fast generation at 2K or 4K.
</p>

<p align="center">
  <img alt="Model id" src="https://img.shields.io/badge/model-nanobanana2-6366f1?style=flat-square">
  <img alt="Type" src="https://img.shields.io/badge/type-image-0ea5e9?style=flat-square">
  <img alt="From" src="https://img.shields.io/badge/from-%240.0707%20%2F%20image-22c55e?style=flat-square">
  <a href="https://kinovi.ai/models/nanobanana-2"><img alt="Model page" src="https://img.shields.io/badge/kinovi.ai-model%20page-111827?style=flat-square"></a>
</p>

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
      <td>Generate a 2K square image from a prompt</td>
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
  "model": "nanobanana2",
  "inputs": {
    "prompt": "A photorealistic close-up of a steaming cup of coffee on a wooden table, morning sunlight streaming through a window, shallow depth of field.",
    "aspectRatio": "1:1",
    "resolution": "2k"
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
| `402` | `{ "message": "Insufficient credits", "required": 15, "available": 0 }` | Not enough credits for this resolution. |
| `429` | `{ "message": "Concurrency limit reached (…)", "limit": 5, "current": 5 }` | Too many tasks in progress; wait for one to finish. |

</details>

| Field | Type | Default | Description |
|:--|:--|:--|:--|
| `model` | `string` | **required** | Must be `"nanobanana2"`. |
| `inputs.prompt` | `string` | **required** | What to generate, or how to edit the reference image. |
| `inputs.uploadedUrls` | `string[]` | – | Up to 9 publicly reachable reference image URLs. Omit for pure text-to-image. |
| `inputs.aspectRatio` | `string` | `3:4` | `1:1` · `4:3` · `3:4` · `16:9` · `9:16`. Examples send `1:1`. |
| `inputs.resolution` | `string` | `2k` | `2k` · `4k`. Examples use `2k`, the cheaper tier. |
| `callBackUrl` | `string` | – | Optional webhook called when the task finishes. |

<br>

## Result

`GET https://kinovi.ai/api/v1/jobs/recordInfo?taskId=task_…`

Poll every couple of seconds until `status` is `success` or `fail`.

```json
{
  "taskId": "task_aiyl5d1c8szu34bk9e6q66gp",
  "model": "nanobanana2",
  "status": "success",
  "creditsUsed": 15,
  "output": [
    {
      "url": "https://static.kinovi.ai/generated-images/2026-09-10/nanobanana2_1789011925743.jpg",
      "width": 2048,
      "height": 2048,
      "mediaType": "image/jpeg"
    }
  ],
  "error": null,
  "createTime": 1789011896200,
  "completeTime": 1789011927104
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

Price is set by `resolution`. Both examples use `2k` ($0.0707 · 15 credits). Live prices: [kinovi.ai/models/nanobanana-2](https://kinovi.ai/models/nanobanana-2).

| | 2K | 4K |
|:--|--:|--:|
| **per image** | $0.0707 · 15 cr | $0.1178 · 25 cr |

<br>

<p align="center">
  <a href="../../README.md">← All models</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/models/nanobanana-2">Model page</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/app/gallery?model=nanobanana2">Playground</a>
</p>
