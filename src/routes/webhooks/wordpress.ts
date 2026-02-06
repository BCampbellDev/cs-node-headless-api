import { Router } from "express";
import asyncHandler from "../../middleware/asyncHandler.js";
import { notifyLaravelWpPublished } from "../../lib/laravel/wpPublished.js";

export const wpWebhooksRouter = Router();

/**
 * WordPress -> Node webhook
 * POST /webhooks/wp/nps-alert-published
 *
 * Expected WP payload (example):
 * {
 *   "npsId": "...",
 *   "wpPostId": 123,
 *   "status": "publish",
 *   "url": "https://.../whatever",
 *   "publishedAt": "2026-02-06T12:00:00Z"
 * }
 */
wpWebhooksRouter.post(
  "/nps-alert-status-changed",
  asyncHandler(async (req, res) => {
    const payload = req.body ?? {};

    // Accept either camelCase or snake_case keys (so you can change WP freely)
    const npsId =
      typeof payload.npsId === "string"
        ? payload.npsId
        : typeof payload.nps_id === "string"
          ? payload.nps_id
          : null;

    const wpPostIdRaw = payload.wpPostId ?? payload.wp_post_id ?? payload.postId ?? payload.post_id;
    const wpPostId = Number.isFinite(Number(wpPostIdRaw)) ? Number(wpPostIdRaw) : null;

    const status =
      typeof payload.status === "string"
        ? payload.status
        : typeof payload.wpStatus === "string"
          ? payload.wpStatus
          : "";

    const url =
      typeof payload.url === "string"
        ? payload.url
        : typeof payload.wpUrl === "string"
          ? payload.wpUrl
          : null;

    const publishedAt =
      typeof payload.publishedAt === "string"
        ? payload.publishedAt
        : typeof payload.published_at === "string"
          ? payload.published_at
          : null;

    if (!npsId || !wpPostId) {
      // Tell WP it sent a bad payload (still quick response)
      return res.status(400).json({
        ok: false,
        error: "Missing required fields",
        required: ["npsId (or nps_id)", "wpPostId (or wp_post_id)"],
        got: { npsId, wpPostId },
      });
    }

    // Respond quickly to WP, then forward in background-ish manner
    // (We still await here so you can see failures in Node logs; if you want *instant* response,
    // we can fire-and-forget and always return ok:true.)
    try {
      const laravelResp = await notifyLaravelWpPublished({
        nps_id: npsId,
        wp_post_id: wpPostId,
        wp_status: status,
        wp_url: url,
        published_at: publishedAt,
      });

      return res.json({ ok: true, forwarded: true, laravel: laravelResp });
    } catch (e: any) {
      console.error("[webhook] forward to laravel failed:", e?.message ?? e);

      // Still 200 so WP doesn't keep retrying forever (your choice).
      // If you *want* WP to retry, return a 500 here.
      return res.json({
        ok: true,
        forwarded: false,
        error: e?.message ?? String(e),
      });
    }
  })
);
