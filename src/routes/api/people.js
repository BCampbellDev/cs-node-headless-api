import { Router } from "express";
import { gql } from "graphql-request";
import { wpClient } from "../../wpgraphql.js";
import { clampFirst } from "../../lib/pagination.js";
import asyncHandler from "../../middleware/asyncHandler.js";
import { UpstreamError } from "../../errors.js";
export const router = Router();
router.get("/people", async (req, res) => {
    const firstRaw = req.query.first;
    const firstNum = typeof firstRaw === "string" ? Number(firstRaw) : 10;
    const first = Math.min(Math.max(Number.isFinite(firstNum) ? firstNum : 10, 1), 50);
    const QUERY = gql `
    query People($first: Int!) {
      people(first: $first) {
        nodes {
          databaseId
          title
        }
      }
    }
  `;
    try {
        const data = await wpClient(false).request(QUERY, { first });
        res.json(data.people.nodes);
    }
    catch (err) {
        throw new UpstreamError("Upstream WPGraphQL error", err?.message ?? String(err));
    }
});
/**
 * GET /api/people/:id
 */
router.get("/people/:id", asyncHandler(async (req, res) => {
    const databaseId = Number(req.params.id);
    if (!Number.isInteger(databaseId) || databaseId <= 0) {
        return res.status(400).json({ error: "Invalid id" });
    }
    const QUERY = gql `
      query PersonByDatabaseId($databaseId: ID!) {
        person(id: $databaseId, idType: DATABASE_ID) {
          databaseId
          title
          content
          uri
        }
      }
    `;
    try {
        const data = await wpClient(false).request(QUERY, { databaseId });
        if (!data?.person)
            return res.status(404).json({ error: "Not found" });
        res.json(data.person);
    }
    catch (err) {
        throw new UpstreamError("Upstream WPGraphQL error", err?.message ?? String(err));
    }
}));
/**
 * GET /api/people/:id/groups
 * Returns groups this person belongs to (your custom connection field on Person).
 */
router.get("/people/:id/groups", asyncHandler(async (req, res) => {
    const databaseId = Number(req.params.id);
    if (!Number.isInteger(databaseId) || databaseId <= 0) {
        return res.status(400).json({ error: "Invalid id" });
    }
    const first = clampFirst(req.query.first, 20);
    const QUERY = gql `
      query PersonGroups($databaseId: ID!, $first: Int!) {
        person(id: $databaseId, idType: DATABASE_ID) {
          databaseId
          title
          groups(first: $first) {
            nodes {
              databaseId
              title
            }
          }
        }
      }
    `;
    try {
        const data = await wpClient(false).request(QUERY, { databaseId, first });
        if (!data?.person)
            return res.status(404).json({ error: "Not found" });
        res.json(data.person.groups.nodes);
    }
    catch (err) {
        throw new UpstreamError("Upstream WPGraphQL error", err?.message ?? String(err));
    }
}));
//# sourceMappingURL=people.js.map