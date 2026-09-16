<h1 align="center">Midjourney Niji V7</h1>

<p align="center">
  Midjourney Niji on the Kinovi API. Anime, manga, and illustration from text, or restyle one reference image.<br>
  Each task returns four images.
</p>

<p align="center">
  <img alt="Model id" src="https://img.shields.io/badge/model-midjourney--v7--niji-6366f1?style=flat-square">
  <img alt="Type" src="https://img.shields.io/badge/type-image-0ea5e9?style=flat-square">
  <img alt="From" src="https://img.shields.io/badge/from-%240.0565%20%2F%204%20images-22c55e?style=flat-square">
  <a href="https://kinovi.ai/models/midjourney-v7-niji"><img alt="Model page" src="https://img.shields.io/badge/kinovi.ai-model%20page-111827?style=flat-square"></a>
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

Each script submits a task, polls until it finishes, and saves the image next to the script. Edit the `INPUTS` block at the top to change the prompt or options. Python and TypeScript save all four outputs; the curl script saves the first.

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
      <td>Generate four 1:1 anime stills from a prompt</td>
      <td><a href="./text-to-image.py"><code>.py</code></a></td>
      <td><a href="./text-to-image.ts"><code>.ts</code></a></td>
      <td><a href="./text-to-image.sh"><code>.sh</code></a></td>
    </tr>
    <tr>
      <td><b>Image to image</b></td>
      <td>Restyle one existing image via <code>uploadedUrls</code></td>
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
  "model": "midjourney-v7-niji",
  "inputs": {
    "prompt": "An anime still of a steaming cup of coffee on a wooden table, morning sunlight, detailed illustration.",
    "aspectRatio": "1:1"
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
| `402` | `{ "message": "Insufficient credits", "required": 12, "available": 0 }` | Not enough credits for this task. |
| `429` | `{ "message": "Concurrency limit reached (…)", "limit": 5, "current": 5 }` | Too many tasks in progress; wait for one to finish. |

</details>

| Field | Type | Default | Description |
|:--|:--|:--|:--|
| `model` | `string` | **required** | Must be `"midjourney-v7-niji"`. |
| `inputs.prompt` | `string` | **required** | What to generate, or how to restyle the reference image. Capped at 6,000 characters — see [Prompt limit](#prompt-limit). |
| `inputs.uploadedUrls` | `string[]` | – | At most 1 publicly reachable reference image URL. Omit for pure text-to-image. A URL that cannot be fetched is ignored; the task still runs without the reference. |
| `inputs.aspectRatio` | `string` | `1:1` | `1:1` · `3:2` · `2:3` · `4:3` · `3:4` · `4:5` · `5:4` · `16:9` · `9:16` · `21:9`. A value outside this list is not rejected — the task runs at `1:1`. Each value maps to a fixed output size; see below. |
| `inputs.stylize` | `integer` | – | Optional. 0–1000. Higher is more stylized. |
| `inputs.chaos` | `integer` | – | Optional. 0–100. Higher is more varied. |
| `inputs.weird` | `integer` | – | Optional. 0–3000. Adds unconventional aesthetics. |
| `inputs.quality` | `number` | – | Optional. One of `0.25` · `0.5` · `1`; any other value is rejected with `400`. |
| `inputs.style` | `string` | – | Optional. `raw` for less opinionated results. Only `raw` is accepted; any other value is rejected with `400`. |
| `inputs.no` | `string` | – | Optional. Negative prompt. |
| `inputs.seed` | `integer` | – | Optional. 0–4294967295. |
| `callBackUrl` | `string` | – | Optional webhook called when the task finishes. |

### Output sizes

`aspectRatio` sets a fixed output size; images are not cropped after the fact.

| `aspectRatio` | Output | `aspectRatio` | Output |
|:--|:--|:--|:--|
| `1:1` | 1024×1024 | `4:5` | 960×1200 |
| `3:2` | 1344×896 | `5:4` | 1200×960 |
| `2:3` | 896×1344 | `16:9` | 1456×816 |
| `4:3` | 1232×928 | `9:16` | 816×1456 |
| `3:4` | 928×1232 | `21:9` | 1680×720 |

### Prompt limit

The 6,000 character cap is applied to your prompt **plus the flags the API appends for the other
inputs**, not to the prompt on its own — so the room left for your prompt shrinks as you add
options. With `"aspectRatio": "1:1"` (the API appends ` --ar 1:1`, 9 characters) the cap lands on
the prompt length exactly:

| Prompt length | Options | Result |
|:--|:--|:--|
| 6,000 | none | accepted |
| 5,991 | `"aspectRatio": "1:1"` | accepted |
| 5,992 | `"aspectRatio": "1:1"` | rejected |

The check runs after the task is accepted: `createTask` returns `200`, then the task ends `fail`
with `Prompts must be 6000 or fewer in length.` Credits are refunded. Leave headroom below 6,000 if
you set other options.

<br>

## Result

`GET https://kinovi.ai/api/v1/jobs/recordInfo?taskId=task_…`

Poll every couple of seconds until `status` is `success` or `fail`. Midjourney jobs usually take 1–2 minutes. On success, `output` has four images.

```json
{
  "taskId": "task_u91bn4h34rr0zy2m5o9z31si",
  "model": "midjourney-v7-niji",
  "status": "success",
  "creditsUsed": 12,
  "output": [
    {
      "url": "https://static.kinovi.ai/generated-images/task_u91bn4h34rr0zy2m5o9z31si-0.png",
      "width": 1024,
      "height": 1024,
      "mediaType": "image/png"
    },
    {
      "url": "https://static.kinovi.ai/generated-images/task_u91bn4h34rr0zy2m5o9z31si-1.png",
      "width": 1024,
      "height": 1024,
      "mediaType": "image/png"
    },
    {
      "url": "https://static.kinovi.ai/generated-images/task_u91bn4h34rr0zy2m5o9z31si-2.png",
      "width": 1024,
      "height": 1024,
      "mediaType": "image/png"
    },
    {
      "url": "https://static.kinovi.ai/generated-images/task_u91bn4h34rr0zy2m5o9z31si-3.png",
      "width": 1024,
      "height": 1024,
      "mediaType": "image/png"
    }
  ],
  "error": null,
  "createTime": 1789012114147,
  "completeTime": 1789012186355
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

Billed per task (four images). Live prices: [kinovi.ai/models/midjourney-v7-niji](https://kinovi.ai/models/midjourney-v7-niji).

| | Rate | Credits |
|:--|--:|--:|
| **Default** | $0.0565 / 4 images | 12 / 4 images |

<br>

<p align="center">
  <a href="../../README.md">← All models</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/models/midjourney-v7-niji">Model page</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/app/gallery?model=midjourney-v7-niji">Playground</a>
</p>
