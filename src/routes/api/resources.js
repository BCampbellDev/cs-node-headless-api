import { Router } from "express";
import { gql } from "graphql-request";
import { wpClient } from "../../wpgraphql.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import { UpstreamError } from "../../errors.js";
export const router = Router();
router.get("/resources", asyncHandler(async (req, res) => {
    const firstRaw = req.query.first;
    const firstNum = typeof firstRaw === "string" ? Number(firstRaw) : 10;
    const first = Math.min(Math.max(Number.isFinite(firstNum) ? firstNum : 10, 1), 50);
    const QUERY = gql `
      query FeaturedResources($first: Int!) {
        featuredResources(first: $first) {
          nodes {
            databaseId
            title
          }
        }
      }
    `;
    try {
        const data = await wpClient(false).request(QUERY, { first });
        res.json(data.featuredResources.nodes);
    }
    catch (err) {
        throw new UpstreamError("Upstream WPGraphQL error", err?.message ?? String(err));
    }
}));
/**
 * GET /api/resources/:id
 * Fetch a single Resource by databaseId.
 */
router.get("/resources/:id", asyncHandler(async (req, res) => {
    const databaseId = Number(req.params.id);
    if (!Number.isInteger(databaseId) || databaseId <= 0) {
        return res.status(400).json({ error: "Invalid id" });
    }
    const QUERY = gql `
      query ResourceByDatabaseId($databaseId: ID!) {
        resource(id: $databaseId, idType: DATABASE_ID) {
          databaseId
          title
          content
          uri
        }
      }
    `;
    try {
        const data = await wpClient(false).request(QUERY, { databaseId });
        if (!data?.resource)
            return res.status(404).json({ error: "Not found" });
        res.json(data.resource);
    }
    catch (err) {
        throw new UpstreamError("Upstream WPGraphQL error", err?.message ?? String(err));
    }
}));
//# sourceMappingURL=resources.js.map