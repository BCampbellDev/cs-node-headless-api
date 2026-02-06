import { fetchNpsAlerts, type NpsAlert } from "../lib/nps.js";
import { upsertNpsAlert } from "../lib/wp/npsAlerts.js";
import { ingestNpsAlertsToLaravel, type LaravelIngestAlert } from "../lib/laravel/npsAlerts.js";

export type SyncParams = {
  parkCode?: string;
  limit?: number;
};

export type SyncResult = {
  parkCode: string | null;
  fetched: number;
  created: number;
  updated: number;
  results: Array<{
    npsId: string;
    alertId: number;
    created: boolean;
    title?: string;
  }>;
  laravel: any; // you can tighten this type later
};

export async function syncNpsAlerts(params: SyncParams): Promise<SyncResult> {
  const alerts = await fetchNpsAlerts(params);

  const results: SyncResult["results"] = [];
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

  // IMPORTANT: no undefined items — build Laravel payload directly from alerts+results by index
  const laravelAlerts: LaravelIngestAlert[] = alerts.flatMap((a, idx) => {
    const r = results[idx];
    if (!r?.created) return [];

    return [
      {
        nps_id: a.id,
        title: a.title,
        park_code: a.parkCode,
        category: a.category ?? null,
        url: a.url ?? null,
        last_indexed_at: a.lastIndexedDate ?? null,
        description: a.description ?? null,
        wp_post_id: r.alertId ?? null,
        wp_status: "draft",
      },
    ];
  });

  let laravel: any = null;
  try {
    laravel = await ingestNpsAlertsToLaravel({
      source: "node-gateway",
      alerts: laravelAlerts,
    });
  } catch (e: any) {
    // don’t fail the whole sync if Laravel is down; report it
    laravel = { ok: false, error: e?.message ?? String(e) };
  }

  return {
    parkCode: params.parkCode ?? null,
    fetched: alerts.length,
    created: createdCount,
    updated: alerts.length - createdCount,
    results,
    laravel,
  };
}
