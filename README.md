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
export KINOVI_API_KEY=your-api-key

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
        <a href="./models/gpt-image-2/image-reference.py"><code>image-reference</code></a>
      </td>
      <td>OpenAI</td>
    </tr>
  </tbody>
</table>

More models are added as they go live on Kinovi. Browse the full catalog and current prices at **[kinovi.ai/models](https://kinovi.ai/models)**.

<br>

## How the API works

All generation models share two endpoints. Authenticate with `Authorization: Bearer $KINOVI_API_KEY`.

<table>
  <tr>
    <td width="80"><b>1</b></td>
    <td><b>Submit</b><br>
      <code>POST https://kinovi.ai/api/v1/jobs/createTask</code><br>
      Body: <code>{ "model": "&lt;model-id&gt;", "inputs": { … } }</code> → returns <code>{ "taskId": "task_…" }</code> immediately.
    </td>
  </tr>
  <tr>
    <td><b>2</b></td>
    <td><b>Poll</b><br>
      <code>GET https://kinovi.ai/api/v1/jobs/recordInfo?taskId=task_…</code><br>
      Repeat every ~2 s until <code>status</code> is <code>success</code> or <code>fail</code>. On success, <code>output</code> is a list of <code>{ url, width, height }</code>.<br>
      Prefer webhooks? Pass <code>callBackUrl</code> in step 1.
    </td>
  </tr>
</table>

Credits are reserved when the task is created and refunded automatically if the upstream model fails. Every `recordInfo` response includes `creditsUsed`.

<details>
<summary><b>Minimal end-to-end example (curl)</b></summary>

```bash
TASK_ID=$(curl -s -X POST https://kinovi.ai/api/v1/jobs/createTask \
  -H "Authorization: Bearer $KINOVI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-image-2","inputs":{"prompt":"a red bicycle on a cobblestone street"}}' \
  | grep -o '"taskId":"[^"]*"' | cut -d'"' -f4)

curl -s "https://kinovi.ai/api/v1/jobs/recordInfo?taskId=$TASK_ID" \
  -H "Authorization: Bearer $KINOVI_API_KEY"
```

</details>

<br>

## Repository layout

```
models/
└── <model-id>/
    ├── README.md          model summary, request & response shape, pricing, tips
    ├── <use-case>.py      Python 3.8+ · standard library only
    ├── <use-case>.ts      Node.js 18+ · native fetch · no dependencies
    └── <use-case>.sh      curl only · no jq
```

Use-case names are shared across models so you always know what to look for: `text-to-image`, `image-reference`, `text-to-video`, `image-to-video`, `reference-to-video`, `text-to-speech`, `voice-clone`.

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
