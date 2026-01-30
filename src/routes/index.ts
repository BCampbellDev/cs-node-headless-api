import { Router } from "express";

export const router = Router();

router.get("/", (_req, res) => {
  res.send("cs-node-headless-api is running. Try /health or /api/resources");
});

router.get("/health", (_req, res) => {
  res.json({ ok: true });
});