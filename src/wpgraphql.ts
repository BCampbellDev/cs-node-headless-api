import { GraphQLClient } from "graphql-request";

/**
 * Create a GraphQL client for talking to WordPress.
 *
 * @param authenticated - whether to include Authorization headers
 */
export function wpClient(authenticated: boolean) {
  const endpoint = process.env.WP_GRAPHQL_URL;

  if (!endpoint) {
    throw new Error("Missing WP_GRAPHQL_URL in environment variables");
  }

  const headers: Record<string, string> = {};

  if (authenticated) {
    console.log("wpClient(auth):", {
      hasAuth: Boolean(process.env.WP_BASIC_AUTH_BASE64),
      authLen: (process.env.WP_BASIC_AUTH_BASE64 || "").length,
    });

    const auth = process.env.WP_BASIC_AUTH_BASE64;

    if (!auth) {
      throw new Error("Missing WP_BASIC_AUTH_BASE64 for authenticated requests");
    }

    headers["Authorization"] = `Basic ${auth}`;
  }

  return new GraphQLClient(endpoint, { headers });
}
