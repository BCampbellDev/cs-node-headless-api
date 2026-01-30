import { Router } from "express";
import { wpClient } from "../wpgraphql.js";

export const router = Router();

router.get("/", (_req, res) => {
  res.send("cs-node-headless-api is running. Try /health or /api/resources");
});

router.get("/health", (_req, res) => {
  res.json({ ok: true });
});

router.get("/debug/viewer", async (_req, res) => {
  try {
    const data = await wpClient(true).request(`query { viewer { username databaseId } }`);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? String(err) });
  }
});
