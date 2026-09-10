# GPT Image 2

OpenAI's GPT Image 2 on the Kinovi API. Generate images from text, or edit and restyle existing images with up to 10 reference images. Strong at photorealism, accurate in-image text, and multi-element compositions.

- Model id: `gpt-image-2`
- Model page & pricing: <https://kinovi.ai/models/gpt-image-2>
- Playground: <https://kinovi.ai/app/gallery?model=gpt-image-2>

## Run an example

Every script is self-contained: copy one file, set your API key, run it. Each one submits a task, polls until it finishes, and saves the image next to the script.

```bash
export KINOVI_API_KEY=your-api-key   # https://kinovi.ai/app/api-keys

python3 text-to-image.py             # Python 3.8+, stdlib only
npx tsx text-to-image.ts             # Node.js 18+, no dependencies
bash text-to-image.sh                # curl only
```

| Example | What it does | Files |
|---|---|---|
| Text to image | Generate a 1K square image from a prompt | [`text-to-image.py`](./text-to-image.py) · [`text-to-image.ts`](./text-to-image.ts) · [`text-to-image.sh`](./text-to-image.sh) |
| Image reference | Restyle an existing image using `uploadedUrls` | [`image-reference.py`](./image-reference.py) · [`image-reference.ts`](./image-reference.ts) · [`image-reference.sh`](./image-reference.sh) |

Edit the `INPUTS` block at the top of any script to change the prompt or options.

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

| Field | Type | Default | Notes |
|---|---|---|---|
| `inputs.prompt` | string | required | Text description of the desired image or edit. |
| `inputs.uploadedUrls` | string[] | – | Reference image URLs, up to 10. Must be publicly reachable. Omit for pure text-to-image. |
| `inputs.aspectRatio` | string | `auto` | `auto`, `1:1`, `4:3`, `3:4`, `16:9`, `9:16`. `auto` follows the reference image when one is given. |
| `inputs.resolution` | string | `1k` | `1k`, `2k`, `4k`. |
| `inputs.quality` | string | `low` | `low`, `medium`, `high`. Together with `resolution` this decides the price. |
| `inputs.outputFormat` | string | `png` | `png`, `jpeg`, `webp`. |
| `inputs.background` | string | `auto` | `auto` or `opaque`. |
| `callBackUrl` | string | – | Optional webhook called when the task finishes. |

Response: `{ "taskId": "task_..." }`

## Result

`GET https://kinovi.ai/api/v1/jobs/recordInfo?taskId=task_...`

Poll every couple of seconds until `status` is `success` or `fail`. A 1K image typically finishes in 20–40 seconds.

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

`status` is one of `waiting`, `generating`, `success`, `fail`. On `fail`, `error.code` and `error.message` explain why and the credits are refunded.

## Pricing

Price depends on `quality` × `resolution`. Both examples default to `low` / `1k`, the cheapest tier. Current per-image prices are listed on the [model page](https://kinovi.ai/models/gpt-image-2).

| | 1K | 2K | 4K |
|---|---|---|---|
| low | $0.010 | $0.020 | $0.030 |
| medium | $0.060 | $0.100 | $0.180 |
| high | $0.220 | $0.400 | $0.720 |

## Tips

- Describe the scene in plain sentences; GPT Image 2 handles long, natural prompts well.
- For text inside the image, quote it exactly: `a neon sign that reads "OPEN LATE"`.
- With reference images, say what to keep and what to change: "keep the pose and outfit, change the background to a rainy street".
- Start at `low` / `1k` to iterate on the prompt, then rerun at `high` / `2k` or `4k` for the final.
