import { Router } from "express";
import asyncHandler from "../../middleware/asyncHandler.js";
import { fetchNpsAlerts } from "../../lib/nps.js";
import { upsertNpsAlert } from "../../lib/wp/npsAlerts.js";

export const npsRouter = Router();

/**
 * POST /api/nps/alerts/sync?parkCode=cane&limit=10
 * Fetch NPS alerts and upsert into WP as nps_alert posts.
 */
npsRouter.post(
  "/alerts/sync",
  asyncHandler(async (req, res) => {
    const parkCode = typeof req.query.parkCode === "string" ? req.query.parkCode : undefined;
    const limitRaw =
      typeof req.query.limit === "string" ? parseInt(req.query.limit, 10) : undefined;
    const limit = Number.isFinite(limitRaw) ? limitRaw : 10;

    const params: { parkCode?: string; limit?: number } = {};

    if (typeof parkCode === "string" && parkCode.length) {
      params.parkCode = parkCode;
    }

    if (typeof limit === "number") {
      params.limit = limit;
    }

    const alerts = await fetchNpsAlerts(params);

    const results = [];
    let createdCount = 0;

    for (const a of alerts) {
      const r = await upsertNpsAlert(a);
      if (r.created) createdCount++;
      results.push({
        npsId: a.id,
        alertId: r.alertId,
        created: r.created,
        title: r.alert?.title,
      });
    }

    res.json({
      parkCode: parkCode ?? null,
      fetched: alerts.length,
      created: createdCount,
      updated: alerts.length - createdCount,
      results,
    });
  })
);
