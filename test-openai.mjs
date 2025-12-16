// test-openai.mjs (ESM)
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("No OPENAI_API_KEY in env. Set it in PowerShell before running.");
  process.exit(1);
}

const client = new OpenAI({ apiKey });

try {
  const res = await client.models.list();
  console.log("OK — models count:", res.data?.length ?? "(unknown)");
} catch (err) {
  console.error("ERROR from OpenAI:", err && err.message ? err.message : err);
}
