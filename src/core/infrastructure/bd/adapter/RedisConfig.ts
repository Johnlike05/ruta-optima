/* eslint-disable no-console */
import Redis from "ioredis";


const REDIS_HOST='10.79.124.99'
const REDIS_PORT=6379
const url = `redis://${REDIS_HOST}:${REDIS_PORT}`;
export const adapter = new Redis(url, {
  connectTimeout: parseInt("4000" ?? "3000"),
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
