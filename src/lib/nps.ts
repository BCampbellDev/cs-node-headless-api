export type NpsAlert = {
  id: string;
  url: string;
  title: string;
  parkCode: string;
  description: string;
  category: string;
  relatedRoadEvents: unknown[];
  lastIndexedDate: string;
};

type NpsAlertsResponse = {
  data: NpsAlert[];
};

export async function fetchNpsAlerts(params: {
  parkCode?: string;
  limit?: number;
}): Promise<NpsAlert[]> {
  const base = process.env.NPS_ALERTS_URL ?? "https://developer.nps.gov/api/v1/alerts";
  const key = process.env.NPS_API_KEY;

  if (!key) throw new Error("Missing NPS_API_KEY");
  const url = new URL(base);

  if (params.parkCode) url.searchParams.set("parkCode", params.parkCode);
  url.searchParams.set("limit", String(params.limit ?? 50));
  url.searchParams.set("api_key", key);

  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`NPS fetch failed: ${res.status} ${res.statusText} ${text}`);
  }

  const json = (await res.json()) as NpsAlertsResponse;
  return Array.isArray(json?.data) ? json.data : [];
}
