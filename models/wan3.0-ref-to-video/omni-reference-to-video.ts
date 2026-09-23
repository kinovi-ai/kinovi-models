// omni-reference-to-video.ts — Build a shot from several reference images with Wan 3.0 on Kinovi.
//
// Usage:
//   Put KINOVI_API_KEY in a .env file (repo root or this folder), or:
//   export KINOVI_API_KEY=your-api-key     # https://kinovi.ai/api-keys
//   npx tsx omni-reference-to-video.ts             # or: node --experimental-strip-types omni-reference-to-video.ts
//
// No third-party dependencies. Node.js 18+.

import { existsSync, readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

function loadDotenv() {
  let folder = dirname(fileURLToPath(import.meta.url));
  while (true) {
    const path = join(folder, ".env");
    if (existsSync(path)) {
      for (const raw of readFileSync(path, "utf8").split(/\r?\n/)) {
        const line = raw.trim();
        if (!line || line.startsWith("#") || !line.includes("=")) continue;
        const eq = line.indexOf("=");
        const key = line.slice(0, eq).trim();
        const value = line.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
        if (key && process.env[key] === undefined) process.env[key] = value;
      }
      return;
    }
    const parent = dirname(folder);
    if (parent === folder) return;
    folder = parent;
  }
}

loadDotenv();

const MODEL = "wan3.0-ref-to-video";
const INPUTS = {
  prompt:
    "A barista sets the coffee cup from @Image1 down on the sunlit wooden table from " +
    "@Image2, steam curling up, slow dolly-in, warm morning light in the style of @Image3.",
  // Up to 10 reference images, cited in the prompt as @Image1, @Image2, ... Replace with your own URLs.
  imageUrls: [
    "https://static.kinovi.ai/generated-images/2026-09-10/gpt_image_2_1789005123161_0.png",
    "https://static.kinovi.ai/generated-images/2026-09-10/nanobanana_pro_1789012003511.png",
    "https://static.kinovi.ai/generated-images/2026-09-10/seedream_5_pro_1789011790741_0.png",
  ],
  aspectRatio: "16:9", // 16:9 | 9:16 | 4:3 | 3:4 | 1:1
  duration: 5, // 2-30 seconds, billed per second
  outputResolution: "720p", // 480p | 720p | 1080p
};

// ---- you normally don't need to edit below this line ----

const API_BASE = "https://kinovi.ai/api/v1";
const API_KEY = process.env.KINOVI_API_KEY;
if (!API_KEY) {
  console.error("Set KINOVI_API_KEY first: export KINOVI_API_KEY=your-api-key");
  process.exit(1);
}

type RecordInfo = {
  taskId: string;
  status: "waiting" | "generating" | "success" | "fail";
  creditsUsed: number;
  output: { url: string; width: number | null; height: number | null }[] | null;
  error: { code: string; message: string } | null;
};

async function api<T>(method: "GET" | "POST", path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${path}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

async function main() {
  // 1. Submit the task
  const { taskId } = await api<{ taskId: string }>("POST", "/jobs/createTask", { model: MODEL, inputs: INPUTS });
  console.log(`Task created: ${taskId}`);

  // 2. Poll until it reaches a terminal state (success | fail)
  let info: RecordInfo;
  while (true) {
    info = await api<RecordInfo>("GET", `/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`);
    if (info.status === "success") break;
    if (info.status === "fail") throw new Error(`Task failed: ${JSON.stringify(info.error)}`);
    console.log(`Status: ${info.status} — waiting...`);
    await new Promise((r) => setTimeout(r, 2000));
  }

  // 3. Download the result
  console.log(`Done. Credits used: ${info.creditsUsed}`);
  const items = info.output ?? [];
  for (const [i, item] of items.entries()) {
    const ext = new URL(item.url).pathname.match(/\.[a-z0-9]+$/i)?.[0] ?? ".mp4";
    const filename = items.length > 1 ? `omni-reference-to-video-${i}${ext}` : `omni-reference-to-video${ext}`;
    await writeFile(filename, Buffer.from(await (await fetch(item.url)).arrayBuffer()));
    console.log(`Saved ${filename}  (${item.width}x${item.height})  ${item.url}`);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
