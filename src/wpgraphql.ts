import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
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

  if (process.env.WP_GRAPHQL_ALLOW_INSECURE === "true") {
    // Allows self-signed HTTPS in local dev only.
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }

  const client = new GraphQLClient(endpoint);

  if (authenticated) {
    const auth = process.env.WP_BASIC_AUTH_BASE64;

    if (!auth) {
      throw new Error("Missing WP_BASIC_AUTH_BASE64 for authenticated requests");
    }

    client.setHeader("Authorization", `Basic ${auth}`);
  }

  return client;
}
