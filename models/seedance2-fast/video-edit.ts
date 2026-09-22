// video-edit.ts — Edit an existing clip with Seedance 2.0 Fast on Kinovi: keep its motion and framing, change what is in it.
//
// Usage:
//   Put KINOVI_API_KEY in a .env file (repo root or this folder), or:
//   export KINOVI_API_KEY=your-api-key     # https://kinovi.ai/app/api-keys
//   npx tsx video-edit.ts             # or: node --experimental-strip-types video-edit.ts
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

const MODEL = "seedance2-fast";
const INPUTS = {
  prompt:
    "Edit this video. Keep the same hand, the same slow hand movements and the same " +
    "camera framing, but change the nail polish to glossy black with fine gold flakes and " +
    "change the grey ribbed sweater to a deep burgundy one. Everything else stays " +
    "identical.",
  // The clip to edit goes in videoUrls (up to 15 s). Describe what to change and what to keep;
  // the output follows the source frame by frame. Match duration to the source length.
  videoUrls: ["https://static.kinovi.ai/videos/seedance_video_1775631198994_17cd129c.mp4"],
  mode: "reference",
  duration: 10, // match the source clip (10 s); 4-15 seconds, billed per second
  outputResolution: "720p", // 480p | 720p
  // Omit aspectRatio to keep the source clip's ratio (9:16 here).
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
    const filename = items.length > 1 ? `video-edit-${i}${ext}` : `video-edit${ext}`;
    await writeFile(filename, Buffer.from(await (await fetch(item.url)).arrayBuffer()));
    console.log(`Saved ${filename}  (${item.width}x${item.height})  ${item.url}`);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
