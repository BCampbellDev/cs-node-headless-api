export type LaravelIngestAlert = {
  nps_id: string;
  title: string;
  park_code: string;
  category?: string | null;
  url?: string | null;
  last_indexed_at?: string | null;
  description?: string | null;

  // optional fields that help the dashboard
  wp_post_id?: number | null;
  wp_status?: string | null;
};

type LaravelIngestResponse = {
  ok: boolean;
  source: string;
  fetched: number;
  created: number;
  updated: number;
};

export async function ingestNpsAlertsToLaravel(input: {
  source: string;
  alerts: LaravelIngestAlert[];
}): Promise<LaravelIngestResponse> {
  const url = process.env.LARAVEL_INGEST_URL;
  const token = process.env.LARAVEL_INGEST_TOKEN;

  if (!url) throw new Error("Missing LARAVEL_INGEST_URL");
  if (!token) throw new Error("Missing LARAVEL_INGEST_TOKEN");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Laravel ingest failed: ${res.status} ${res.statusText} ${text}`);
  }

  return JSON.parse(text) as LaravelIngestResponse;
}
