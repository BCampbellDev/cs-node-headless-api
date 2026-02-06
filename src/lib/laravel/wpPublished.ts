export type LaravelWpPublishedPayload = {
  nps_id: string;
  wp_post_id: number;
  wp_status: string; // "publish"
  wp_url?: string | null;
  published_at?: string | null;
};

type LaravelWpPublishedResponse = {
  ok: boolean;
  nps_id: string;
  wp_post_id: number;
  wp_status: string;
};

export async function notifyLaravelWpPublished(
  payload: LaravelWpPublishedPayload
): Promise<LaravelWpPublishedResponse> {
  const url = process.env.LARAVEL_WP_PUBLISHED_URL;
  const token = process.env.LARAVEL_WP_PUBLISHED_TOKEN;

  if (!url) throw new Error("Missing LARAVEL_WP_PUBLISHED_URL");
  if (!token) throw new Error("Missing LARAVEL_WP_PUBLISHED_TOKEN");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Laravel wp-published failed: ${res.status} ${res.statusText} ${text}`);
  }

  return JSON.parse(text) as LaravelWpPublishedResponse;
}
