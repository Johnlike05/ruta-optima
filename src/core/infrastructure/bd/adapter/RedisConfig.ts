/* eslint-disable no-console */
import Redis from "ioredis";

const url = `redis://default:ispjLYdfRvdXIxbfN00IY9jhe051W4TL@redis-15763.c1.us-central1-2.gce.redns.redis-cloud.com:15763`;
export const adapter = new Redis(url, {
  connectTimeout: parseInt("4000"),
});

adapter.on("connect", () => {
  const date = new Date().toLocaleString();
  if (!process.env.JEST_WORKER_ID) {
    console.log(`[INFO] Conectado al servidor de redis: ${date}`);
  }
});

adapter.on("error", async (e: Error) => {
  console.log("REDIS ERROR ==> ", e?.message ?? e);
});
