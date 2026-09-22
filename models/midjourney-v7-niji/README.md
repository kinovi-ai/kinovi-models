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
| `inputs.prompt` | `string` | **required** | What to generate, or how to restyle the reference image. Plain text; Midjourney `--flags` may be written inline (see [Prompt rules](#prompt-rules)). Capped at 6,000 characters — see [Prompt limit](#prompt-limit). |
| `inputs.uploadedUrls` | `string[]` | – | At most 1 publicly reachable reference image URL, used as the image prompt. Omit for pure text-to-image. A URL that cannot be fetched is ignored and the task runs without the reference; an image that fails Midjourney's image filters ends the task in `fail` (see [Error codes](#error-codes)). |
| `inputs.aspectRatio` | `string` | `1:1` | `1:1` · `3:2` · `2:3` · `4:3` · `3:4` · `4:5` · `5:4` · `16:9` · `9:16` · `21:9`. A value outside this list is not rejected — the task runs at `1:1`. Each value maps to a fixed output size; see below. |
| `inputs.stylize` | `integer` | – | Optional. 0–1000. Higher is more stylized. |
| `inputs.chaos` | `integer` | – | Optional. 0–100. Higher is more varied. |
| `inputs.weird` | `integer` | – | Optional. 0–3000. Adds unconventional aesthetics. |
| `inputs.quality` | `number` | – | Optional. One of `0.25` · `0.5` · `1`; any other value is rejected with `400`. Accepted for parity with the other Midjourney models, but Niji has no quality setting — the value does not change the output. |
| `inputs.style` | `string` | – | Optional. `raw` for less opinionated results. Only `raw` is accepted; any other value is rejected with `400`. |
| `inputs.no` | `string` | – | Optional. Negative prompt: comma-separated things to leave out (`"text, watermark"`). Some words are not allowed here even though they are fine in the prompt — see [Prompt rules](#prompt-rules). |
| `inputs.seed` | `integer` | – | Optional. 0–4294967295. |
| `inputs.autoFix` | `boolean` | `true` | When Midjourney rejects the prompt for a banned word or a moderation flag, Kinovi edits the wording and resubmits so the task still completes. Set `false` to receive the rejection as a `fail` instead — see [Prompt rules](#prompt-rules). |
| `callBackUrl` | `string` | – | Optional webhook called when the task finishes. |

### Prompt rules

Midjourney screens every prompt before rendering. Knowing the rules up front saves a round trip; knowing what Kinovi does on your behalf tells you what to expect back.

**Banned words.** Midjourney keeps a word list that is stricter than most moderation — everyday words like `exposed`, `bleed`, `vein`, `barefoot`, `bikini`, `surgery` or `reproduce` are rejected regardless of context, and Midjourney reports one offending word at a time. Anatomy, violence, gore, nudity and sexualised wording are the largest groups. A separate AI moderator can also reject a prompt without naming a word when the overall theme reads as adult or violent.

**Auto-fix (default).** With `autoFix` on, a rejected prompt is not returned to you as a failure. Kinovi removes the reported word (or, when no word is named, rephrases the prompt to keep the scene and drop the flagged element) and resubmits. This happens inside the task: `status` stays `generating`, no extra credits are charged, and the four images are rendered from the adjusted prompt. When the prompt still cannot pass, the task ends in `fail` with the original rejection so you can act on it. If you need to know the exact wording that was rendered — for example in a tool that lets users copy prompts — set `autoFix: false` and handle `banned_prompt_words` yourself.

**`--no` is stricter than the prompt.** Words that Midjourney accepts in a prompt can still be banned inside `--no`. `clothing` and `clothes` are the common case: `"prompt": "portrait in casual clothing"` is fine, `"no": "clothing"` fails the task. Auto-fix removes such terms from `--no` only; the prompt body is left intact.

**Inline flags.** You can write Midjourney parameters directly in the prompt (`a red bicycle --ar 16:9 --s 250 --style raw --no text`). Rules:

- An inline flag wins over the matching field: with `--ar 16:9` in the prompt, `inputs.aspectRatio` is ignored. An inline ratio outside the supported list is dropped and the field (or `1:1`) applies.
- Leave `--v` and `--niji` out. The model adds `--niji 7` for you; a `--v` you write is passed through as written and switches the render away from Niji.
- `--q` / `--quality` are removed before submit — Niji has no quality setting.
- A leading `/imagine prompt:` or `/` is stripped, so pasting from Discord works.
- A lone `--` is read as a comma, but `---` (for example a Markdown divider) reaches Midjourney as an empty parameter and fails the task with `Unrecognized parameter(s)`. Use commas or line breaks to separate ideas.
- Flags this model does not support fail after the task is created, with the message naming the flag: `--sw` / `--cw` without their `--sref` / `--cref`, `--hd`, personalization codes (`--p xxxx`), `--stylize` outside 0–1000. Credits are refunded. If you only need aspect ratio, stylize, chaos, weird, quality, raw style, negative prompt or seed, prefer the structured fields — they are validated with a `400` before any credits move.

**Length.** The prompt plus everything the API appends for the other fields must fit in 6,000 characters. See [Prompt limit](#prompt-limit).

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

Poll every 5–10 seconds until `status` is `success` or `fail`. Most tasks finish in 30–60 seconds; allow up to 90 seconds under load, and up to 10 minutes when auto-fix has to resubmit the prompt. Poll for at least 10 minutes before treating a task as stuck. On success, `output` has four images in the order Midjourney rendered them; `width` / `height` follow the [output size](#output-sizes) for the aspect ratio.

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

`creditsUsed` is the amount reserved at submit; `recordInfo` does not carry a refund flag, so a `fail` still shows the original `creditsUsed` even though the credits are back in your balance.

### Error codes

Validation problems (`400`) are caught at `createTask` and never become a task. Everything below is reported on `recordInfo` as `status: "fail"` after the task was accepted, and the credits are refunded. Most are about the prompt or the reference image and are worth surfacing to your users as-is; a few are transient and worth one retry on your side.

<details>
<summary>Error codes seen in <code>fail</code></summary>

| `error.code` | `error.message` (example) | Cause · what to do |
|:--|:--|:--|
| `banned_prompt_words` | `banned prompt words：exposed` | The prompt contains a word on Midjourney's list; the message names it. Only seen with `autoFix: false`, or when auto-fix ran out of ways to rephrase. Remove or replace the word and resubmit. |
| `500` | `[Banned prompt detected] Content violates community standards.` | Midjourney's AI moderator rejected the prompt as a whole without naming a word. Tone down adult, violent or gory themes. |
| `500` | `Invalid prompt parameter. Please check your prompt settings and try again.` | A word in `no` (or an inline `--no`) is not allowed there, most often `clothing` / `clothes`. Drop it from the negative prompt. |
| `500` | `Your uploaded image violates platform rules. Please use a different image.` | The `uploadedUrls` image was rejected by Midjourney's image filters. Rewording the prompt does not help; use a different image. |
| `500` | `Your content was blocked by moderation. Please adjust your prompt or uploaded media and try again.` | A safety review flagged the request. Adjust the prompt or the reference image. |
| `500` | `Sorry, while the prompt you entered was deemed safe, the generated image may fall outside our community guidelines.` | The prompt passed but the rendered image did not. Rerun as-is or with a different `seed`; the outcome varies. |
| `500` | `Prompts must be 6000 or fewer in length.` | Prompt plus appended flags exceeds 6,000 characters — see [Prompt limit](#prompt-limit). |
| `500` | ``[Invalid parameter] Unrecognized parameter(s): `---` `` | An inline token Midjourney does not know — usually a stray `---` or an unsupported flag. See [Prompt rules](#prompt-rules). |
| `500` | ``[Invalid parameter] Cannot use `--sw` without a `--sref` `` | Paired inline flags used alone (`--sw` / `--cw`). Add the partner flag or remove both. |
| `500` | ``[Invalid parameter] `--stylize` must be between 0 and 1000`` | An inline flag value out of range. Use the structured field instead; it is validated before submit. |
| `500` | `[unknown] Invalid User ID or Personalization code: …` | A `--p` personalization code from another account. Remove it. |
| `500` | `Service temporarily unavailable. Please try again later.` | Capacity problem on the generation side. Retry after a short delay. |
| `500` | `You have reached the maximum of job queues. Please try again later.` | Queue congestion. Retry after 30–60 seconds. |
| `500` | `Execution error, system exception.` | Transient rendering error. Retry once as-is. |

</details>

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
