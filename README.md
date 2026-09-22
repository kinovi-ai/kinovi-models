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
      <td><a href="./models/gpt-image-2.5-sunburst"><b>GPT Image 2.5 Sunburst</b></a></td>
      <td>Image</td>
      <td>
        <a href="./models/gpt-image-2.5-sunburst/text-to-image.py"><code>text-to-image</code></a> ·
        <a href="./models/gpt-image-2.5-sunburst/image-to-image.py"><code>image-to-image</code></a>
      </td>
      <td>OpenAI</td>
    </tr>
    <tr>
      <td><a href="./models/gpt-image-2.5-flare"><b>GPT Image 2.5 Flare</b></a></td>
      <td>Image</td>
      <td>
        <a href="./models/gpt-image-2.5-flare/text-to-image.py"><code>text-to-image</code></a> ·
        <a href="./models/gpt-image-2.5-flare/image-to-image.py"><code>image-to-image</code></a>
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
      <td><a href="./models/seedance-20"><b>Seedance 2.0</b></a></td>
      <td>Video</td>
      <td>
        <a href="./models/seedance-20/text-to-video.py"><code>text-to-video</code></a> ·
        <a href="./models/seedance-20/image-to-video.py"><code>image-to-video</code></a> ·
        <a href="./models/seedance-20/first-last-frame-to-video.py"><code>first-last-frame-to-video</code></a> ·
        <a href="./models/seedance-20/omni-reference-to-video.py"><code>omni-reference-to-video</code></a> ·
        <a href="./models/seedance-20/reference-to-video.py"><code>reference-to-video</code></a> ·
        <a href="./models/seedance-20/video-edit.py"><code>video-edit</code></a> ·
        <a href="./models/seedance-20/video-extend.py"><code>video-extend</code></a>
      </td>
      <td>ByteDance</td>
    </tr>
    <tr>
      <td><a href="./models/seedance2-fast"><b>Seedance 2.0 Fast</b></a></td>
      <td>Video</td>
      <td>
        <a href="./models/seedance2-fast/text-to-video.py"><code>text-to-video</code></a> ·
        <a href="./models/seedance2-fast/image-to-video.py"><code>image-to-video</code></a> ·
        <a href="./models/seedance2-fast/first-last-frame-to-video.py"><code>first-last-frame-to-video</code></a> ·
        <a href="./models/seedance2-fast/omni-reference-to-video.py"><code>omni-reference-to-video</code></a> ·
        <a href="./models/seedance2-fast/reference-to-video.py"><code>reference-to-video</code></a> ·
        <a href="./models/seedance2-fast/video-edit.py"><code>video-edit</code></a> ·
        <a href="./models/seedance2-fast/video-extend.py"><code>video-extend</code></a>
      </td>
      <td>ByteDance</td>
    </tr>
    <tr>
      <td><a href="./models/seedance2.0-mini"><b>Seedance 2.0 Mini</b></a></td>
      <td>Video</td>
      <td>
        <a href="./models/seedance2.0-mini/text-to-video.py"><code>text-to-video</code></a> ·
        <a href="./models/seedance2.0-mini/image-to-video.py"><code>image-to-video</code></a> ·
        <a href="./models/seedance2.0-mini/first-last-frame-to-video.py"><code>first-last-frame-to-video</code></a> ·
        <a href="./models/seedance2.0-mini/omni-reference-to-video.py"><code>omni-reference-to-video</code></a> ·
        <a href="./models/seedance2.0-mini/reference-to-video.py"><code>reference-to-video</code></a> ·
        <a href="./models/seedance2.0-mini/video-edit.py"><code>video-edit</code></a> ·
        <a href="./models/seedance2.0-mini/video-extend.py"><code>video-extend</code></a>
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
| `success` | Done — results are in `output[]` |
| `fail` | Failed — `error.code` / `error.message` explain why; credits are refunded |

Video and audio models return the same shape; `output[].url` points at an `.mp4` / `.wav` and `mediaType` tells you which.

| Field | Type | Description |
|:--|:--|:--|
| `taskId` | `string` | The id you submitted. |
| `model` | `string` | The `model` you sent. |
| `status` | `string` | `waiting` · `generating` · `success` · `fail`. |
| `creditsUsed` | `number` | Credits reserved for the task. Not adjusted on refund — a `fail` still shows the original amount. |
| `output` | `object[] \| null` | `null` until `success`. Each item has `url`, `width`, `height`, `mediaType`; video models add `seed` and `lastFrameImage`. Each model README lists its exact fields under **Output fields**. |
| `error` | `object \| null` | `null` unless `fail`; then `{ code, message }`. Each model README lists the codes it can return. |
| `createTime` | `number` | Unix ms when the task was accepted. |
| `completeTime` | `number \| null` | Unix ms when it reached `success` / `fail`. |

### 3. Webhook instead of polling (optional)

Add a top-level `callBackUrl` to `createTask` and Kinovi `POST`s once when the task reaches `success` or `fail`. The body wraps the same object `recordInfo` returns:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "taskId": "task_d5ibgnwdlw8fe3zpptx9mp0f",
    "model": "gpt-image-2",
    "status": "success",
    "creditsUsed": 2.17,
    "output": [ { "url": "…", "width": 1024, "height": 1024, "mediaType": "image/png" } ],
    "error": null,
    "createTime": 1789005095581,
    "completeTime": 1789005126039
  }
}
```

Respond with any `2xx`. The callback is sent once and not retried, so keep `recordInfo` as the source of truth if delivery matters. Full reference: [kinovi.ai/docs/api#webhooks](https://kinovi.ai/docs/api#webhooks).

### Reference files

Models take reference images, video and audio as URLs. Any URL the generation backend can fetch works — your CDN, object storage, a public site. For files on your machine, upload them to Kinovi first:

```bash
# 1. ask for an upload URL (metadata only)
curl -s -X POST https://kinovi.ai/api/v1/uploads \
  -H "Authorization: Bearer $KINOVI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "fileName": "reference.png" }'
# → { "uploadUrl": "https://…", "url": "https://static.…/temp-uploads/…png", "contentType": "image/png", … }

# 2. PUT the raw bytes to uploadUrl (no API key; the URL is signed)
curl -s -X PUT "$UPLOAD_URL" -H "Content-Type: image/png" --data-binary @reference.png

# 3. pass "url" in the model's reference field (uploadedUrls / imageUrls / …)
```

Uploads are deleted after 24 hours; generated outputs are not. There is no file-size limit on Kinovi's side. Full reference, with Python and Node helpers: [kinovi.ai/docs/uploads](https://kinovi.ai/docs/uploads).

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

Use-case names are shared across models so you always know what to look for: `text-to-image`, `image-to-image`, `text-to-video`, `image-to-video`, `first-last-frame-to-video`, `omni-reference-to-video`, `reference-to-video`, `video-edit`, `video-extend`, `text-to-speech`, `voice-clone`.

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
