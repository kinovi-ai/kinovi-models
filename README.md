<p align="center">
  <a href="https://kinovi.ai">
    <img src="https://kinovi.ai/kinovi-logo-tight.png" alt="Kinovi" width="220">
  </a>
</p>

<h1 align="center">Kinovi Models</h1>

<p align="center">
  Runnable examples for every model on the Kinovi API.<br>
  One folder per model · one script per use case · Python, TypeScript and curl.
</p>

<p align="center">
  <a href="https://kinovi.ai/models"><img alt="Model catalog" src="https://img.shields.io/badge/catalog-kinovi.ai%2Fmodels-6366f1?style=flat-square"></a>
  <a href="https://kinovi.ai/openapi.json"><img alt="OpenAPI" src="https://img.shields.io/badge/API-OpenAPI%203-0ea5e9?style=flat-square"></a>
  <a href="./LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-22c55e?style=flat-square"></a>
</p>

<br>

## Quick start

```bash
# 1. Get an API key → https://kinovi.ai/app/api-keys
cp .env.example .env            # then paste KINOVI_API_KEY=...
# or: export KINOVI_API_KEY=your-api-key

# 2. Grab the examples
git clone https://github.com/kinovi-ai/kinovi-models.git
cd kinovi-models/models/gpt-image-2

# 3. Run one
python3 text-to-image.py          # Python 3.8+, standard library only
npx tsx text-to-image.ts          # Node.js 18+, no dependencies
bash text-to-image.sh             # curl only
```

Every script is a single file with no shared imports. Copy it anywhere, edit the `INPUTS` block at the top, run it. It submits the task, polls until it finishes, and saves the result next to the script.

<br>

## Models

<table>
  <thead>
    <tr>
      <th align="left">Model</th>
      <th align="left">Type</th>
      <th align="left">Examples</th>
      <th align="left">Provider</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="./models/gpt-image-2"><b>GPT Image 2</b></a></td>
      <td>Image</td>
      <td>
        <a href="./models/gpt-image-2/text-to-image.py"><code>text-to-image</code></a> ·
        <a href="./models/gpt-image-2/image-to-image.py"><code>image-to-image</code></a>
      </td>
      <td>OpenAI</td>
    </tr>
    <tr>
      <td><a href="./models/seedream-5.0-pro"><b>Seedream 5.0 Pro</b></a></td>
      <td>Image</td>
      <td>
        <a href="./models/seedream-5.0-pro/text-to-image.py"><code>text-to-image</code></a> ·
        <a href="./models/seedream-5.0-pro/image-to-image.py"><code>image-to-image</code></a>
      </td>
      <td>ByteDance</td>
    </tr>
    <tr>
      <td><a href="./models/nanobanana2"><b>NanoBanana 2</b></a></td>
      <td>Image</td>
      <td>
        <a href="./models/nanobanana2/text-to-image.py"><code>text-to-image</code></a> ·
        <a href="./models/nanobanana2/image-to-image.py"><code>image-to-image</code></a>
      </td>
      <td>Google Gemini</td>
    </tr>
    <tr>
      <td><a href="./models/nanobanana-pro"><b>Nano Banana Pro</b></a></td>
      <td>Image</td>
      <td>
        <a href="./models/nanobanana-pro/text-to-image.py"><code>text-to-image</code></a> ·
        <a href="./models/nanobanana-pro/image-to-image.py"><code>image-to-image</code></a>
      </td>
      <td>Google Gemini</td>
    </tr>
    <tr>
      <td><a href="./models/midjourney-v8"><b>Midjourney V8</b></a></td>
      <td>Image</td>
      <td>
        <a href="./models/midjourney-v8/text-to-image.py"><code>text-to-image</code></a> ·
        <a href="./models/midjourney-v8/image-to-image.py"><code>image-to-image</code></a>
      </td>
      <td>Midjourney</td>
    </tr>
    <tr>
      <td><a href="./models/midjourney-v7-niji"><b>Midjourney Niji V7</b></a></td>
      <td>Image</td>
      <td>
        <a href="./models/midjourney-v7-niji/text-to-image.py"><code>text-to-image</code></a> ·
        <a href="./models/midjourney-v7-niji/image-to-image.py"><code>image-to-image</code></a>
      </td>
      <td>Midjourney</td>
    </tr>
  </tbody>
</table>

More models are added as they go live on Kinovi. Browse the full catalog and current prices at **[kinovi.ai/models](https://kinovi.ai/models)**.

<br>

## How the API works

All generation models share two endpoints. Authenticate with `Authorization: Bearer $KINOVI_API_KEY`.

### 1. Submit a task

`POST https://kinovi.ai/api/v1/jobs/createTask`

```bash
curl -X POST https://kinovi.ai/api/v1/jobs/createTask \
  -H "Authorization: Bearer $KINOVI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-image-2",
    "inputs": { "prompt": "a red bicycle on a cobblestone street" }
  }'
```

Response `200 OK` — returned immediately. Credits for the task are reserved at this point.

```json
{
  "taskId": "task_d5ibgnwdlw8fe3zpptx9mp0f"
}
```

`inputs` is model-specific; each model folder documents its fields. Add an optional top-level `callBackUrl` if you want a webhook instead of polling.

### 2. Poll for the result

`GET https://kinovi.ai/api/v1/jobs/recordInfo?taskId=…`

```bash
curl "https://kinovi.ai/api/v1/jobs/recordInfo?taskId=task_d5ibgnwdlw8fe3zpptx9mp0f" \
  -H "Authorization: Bearer $KINOVI_API_KEY"
```

Repeat every couple of seconds while `status` is `waiting` or `generating`. Stop on `success` or `fail`.

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
| `success` | Done — results are in `output[]` |
| `fail` | Failed — `error.code` / `error.message` explain why; credits are refunded |

Video and audio models return the same shape; `output[].url` points at an `.mp4` / `.wav` and `mediaType` tells you which.

<br>

## Repository layout

```
models/
└── <model-id>/
    ├── README.md          model summary, request & response shape, pricing
    ├── <use-case>.py      Python 3.8+ · standard library only
    ├── <use-case>.ts      Node.js 18+ · native fetch · no dependencies
    └── <use-case>.sh      curl only · no jq
```

Use-case names are shared across models so you always know what to look for: `text-to-image`, `image-to-image`, `text-to-video`, `image-to-video`, `reference-to-video`, `text-to-speech`, `voice-clone`.

<br>

## Links

| | |
|---|---|
| Model catalog & pricing | <https://kinovi.ai/models> |
| API keys | <https://kinovi.ai/app/api-keys> |
| OpenAPI spec | <https://kinovi.ai/openapi.json> |
| Playground | <https://kinovi.ai/app/gallery> |

<br>

## Contributing

Found a broken example or want a use case covered? [Open an issue](https://github.com/kinovi-ai/kinovi-models/issues). Scripts are maintained by the Kinovi team and kept in sync with the live API.

## License

[MIT](./LICENSE)
