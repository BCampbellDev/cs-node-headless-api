import { Router } from "express";
import asyncHandler from "../../middleware/asyncHandler.js";
import { fetchNpsAlerts } from "../../lib/nps.js";
import { upsertNpsAlert } from "../../lib/wp/npsAlerts.js";
import { ingestNpsAlertsToLaravel } from "../../lib/laravel/npsAlerts.js";

export const npsRouter = Router();

/**
 * POST /api/alerts/sync?parkCode=cane&limit=10
 *
 * 1) Fetch NPS alerts from NPS API
 * 2) Upsert into WordPress (nps_alert CPT) via WPGraphQL mutation
 * 3) Upsert into Laravel (nps_alerts table) via Laravel ingest endpoint
 */
npsRouter.post(
  "/alerts/sync",
  asyncHandler(async (req, res) => {
    // ---- parse query params safely ----
    const parkCode = typeof req.query.parkCode === "string" ? req.query.parkCode : undefined;

    const limitRaw =
      typeof req.query.limit === "string" ? parseInt(req.query.limit, 10) : undefined;
    const limit = Number.isFinite(limitRaw) ? (limitRaw as number) : 10;

    const params: { parkCode?: string; limit?: number } = {};
    if (parkCode && parkCode.length) params.parkCode = parkCode;
    params.limit = limit;

    // ---- 1) fetch from NPS ----
    const alerts = await fetchNpsAlerts(params);

    // ---- 2) upsert into WP + build payloads for Laravel ----
    const results: Array<{
      npsId: string;
      alertId: number;
      created: boolean;
      title?: string;
    }> = [];

    const laravelAlerts: Array<{
      nps_id: string;
      title: string;
      park_code: string;
      category?: string | null;
      url?: string | null;
      last_indexed_at?: string | null;
      description?: string | null;
      wp_post_id?: number | null;
      wp_status?: string | null;
    }> = [];

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

      laravelAlerts.push({
        nps_id: a.id,
        title: a.title,
        park_code: a.parkCode,
        category: a.category ?? null,
        url: a.url ?? null,
        last_indexed_at: a.lastIndexedDate ?? null,
        description: a.description ?? null,
        wp_post_id: r.alertId ?? null,
        wp_status: r.created ? "created" : "updated",
      });
    }

    // ---- 3) ingest into Laravel (don’t fail the whole request if Laravel is down) ----
    let laravel: any = null;
    try {
      laravel = await ingestNpsAlertsToLaravel({
        source: "node-gateway",
        alerts: laravelAlerts,
      });
    } catch (e: any) {
      laravel = { ok: false, error: e?.message ?? String(e) };
    }

    return res.json({
      parkCode: parkCode ?? null,
      fetched: alerts.length,
      created: createdCount,
      updated: alerts.length - createdCount,
      results,
      laravel,
    });
  })
);
