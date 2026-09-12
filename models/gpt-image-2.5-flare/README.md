<h1 align="center">GPT Image 2.5 Flare</h1>

<p align="center">
  OpenAI GPT Image 2.5 Flare on the Kinovi API — the speed-oriented face of GPT Image 2.5.<br>
  Same fields as Sunburst: text to image, up to 16 references, five quality tiers, 1K–4K, PNG or JPEG, token billing.
</p>

<p align="center">
  <img alt="Model id" src="https://img.shields.io/badge/model-gpt--image--2.5--flare-6366f1?style=flat-square">
  <img alt="Type" src="https://img.shields.io/badge/type-image-0ea5e9?style=flat-square">
  <img alt="From" src="https://img.shields.io/badge/from-%7E%241.75%20%2F%20image%20(estimate)-22c55e?style=flat-square">
  <a href="https://kinovi.ai/models/gpt-image-2.5-flare"><img alt="Model page" src="https://img.shields.io/badge/kinovi.ai-model%20page-111827?style=flat-square"></a>
</p>

<br>

## Run an example

```bash
export KINOVI_API_KEY=your-api-key   # https://kinovi.ai/app/api-keys

python3 text-to-image.py
npx tsx text-to-image.ts
bash text-to-image.sh
```

See **[GPT Image 2.5 Sunburst](../gpt-image-2.5-sunburst/README.md)** for the full field reference, pricing table, and request/response shapes — only the `model` id changes.

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
      <td>Restyle via <code>uploadedUrls</code> (up to 16)</td>
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
  "model": "gpt-image-2.5-flare",
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

Response:

```json
{
  "taskId": "task_v7ky0xrcw5rykz6q4mtpnlzk"
}
```

Use `"model": "gpt-image-2.5-flare"` — all other `inputs` match Sunburst. Full docs: [../gpt-image-2.5-sunburst/README.md](../gpt-image-2.5-sunburst/README.md).

<br>

<p align="center">
  <a href="../../README.md">← All models</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/models/gpt-image-2.5-flare">Model page</a> &nbsp;·&nbsp;
  <a href="https://kinovi.ai/app/gallery?model=gpt-image-2.5-flare">Playground</a>
</p>
