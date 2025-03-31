/* eslint-disable no-console */
import Redis from "ioredis";

const url = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
export const adapter = new Redis(url, {
  connectTimeout: parseInt(process.env.REDIS_TIMEOUT ?? "3000"),
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
