// first-last-frame-to-video.ts — Move from a first frame to a last frame with Wan 3.0 Prime on Kinovi.
//
// Usage:
//   Put KINOVI_API_KEY in a .env file (repo root or this folder), or:
//   export KINOVI_API_KEY=your-api-key     # https://kinovi.ai/api-keys
//   npx tsx first-last-frame-to-video.ts             # or: node --experimental-strip-types first-last-frame-to-video.ts
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

const MODEL = "wan3.0-prime-image-to-video";
const INPUTS = {
  prompt:
    "Smooth cinematic move from the first frame to the last frame: the camera glides " +
    "around the coffee cup as steam rises and the morning light shifts across the table.",
  // Exactly 2 images: the first is the opening frame, the second is the closing frame.
  imageUrls: [
    "https://static.kinovi.ai/generated-images/task_u91bn4h34rr0zy2m5o9z31si-0.png",
    "https://static.kinovi.ai/generated-images/task_u91bn4h34rr0zy2m5o9z31si-1.png",
  ],
  aspectRatio: "16:9", // 16:9 | 9:16 | 4:3 | 3:4 | 1:1 | adaptive (keep the image's ratio)
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
    const filename = items.length > 1 ? `first-last-frame-to-video-${i}${ext}` : `first-last-frame-to-video${ext}`;
    await writeFile(filename, Buffer.from(await (await fetch(item.url)).arrayBuffer()));
    console.log(`Saved ${filename}  (${item.width}x${item.height})  ${item.url}`);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
