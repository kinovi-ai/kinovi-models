# Kinovi Models

Runnable examples for every model on the [Kinovi API](https://kinovi.ai). One folder per model, one script per use case, in Python, TypeScript, and plain curl. Copy a file, set your API key, run it.

```bash
export KINOVI_API_KEY=your-api-key           # https://kinovi.ai/app/api-keys

git clone https://github.com/kinovi-ai/kinovi-models.git
cd kinovi-models/models/gpt-image-2
python3 text-to-image.py                     # or: npx tsx text-to-image.ts / bash text-to-image.sh
```

## Models

| Model | What it does | Examples |
|---|---|---|
| [GPT Image 2](./models/gpt-image-2) | Text to image, image editing with references (OpenAI) | `text-to-image`, `image-reference` |

More models are added as they go live. The full catalog and current prices are at <https://kinovi.ai/models>.

## How the API works

Every generation model uses the same two endpoints. Authenticate with `Authorization: Bearer $KINOVI_API_KEY`.

1. **Submit** — `POST https://kinovi.ai/api/v1/jobs/createTask` with `{ "model": "<model-id>", "inputs": { ... } }`. Returns `{ "taskId": "task_..." }` immediately.
2. **Poll** — `GET https://kinovi.ai/api/v1/jobs/recordInfo?taskId=task_...` every couple of seconds until `status` is `success` or `fail`. On success, `output` is a list of `{ url, width, height }`. Pass `callBackUrl` in step 1 if you prefer a webhook.

Credits are charged when the task is created and refunded automatically if the upstream model fails. `recordInfo` reports `creditsUsed` on every task.

Full reference: <https://kinovi.ai/openapi.json>

## Layout

```
models/
  <model-id>/
    README.md            model summary, request/response shape, pricing, tips
    <use-case>.py        Python 3.8+, standard library only
    <use-case>.ts        Node.js 18+, native fetch, no dependencies
    <use-case>.sh        curl only
```

Scripts never import from each other, so any single file works on its own. The editable part is always the `INPUTS` block at the top.

## Contributing

Found a broken example or want a use case covered? Open an issue. Example scripts are maintained by the Kinovi team and kept in sync with the live API.

## License

MIT
