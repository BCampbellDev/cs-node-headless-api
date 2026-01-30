import { Router } from "express";
import { gql } from "graphql-request";
import { wpClient } from "../../wpgraphql.js";
import { clampFirst } from "../../lib/pagination.js";

import asyncHandler from "../../middleware/asyncHandler.js";
import { UpstreamError } from "../../errors.js";

export const router = Router();

router.get(
  "/groups",
  asyncHandler(async (req, res) => {
    const firstRaw = req.query.first;
    const firstNum = typeof firstRaw === "string" ? Number(firstRaw) : 10;
    const first = Math.min(Math.max(Number.isFinite(firstNum) ? firstNum : 10, 1), 50);

    const QUERY = gql`
      query Groups($first: Int!) {
        groups(first: $first) {
          nodes {
            databaseId
            title
          }
        }
      }
    `;

    try {
      const data = await wpClient(false).request(QUERY, { first });
      res.json(data.groups.nodes);
    } catch (err: any) {
      throw new UpstreamError("Upstream WPGraphQL error", err?.message ?? String(err));
    }
  })
);

/**
 * GET /api/groups/:id
 */
router.get(
  "/groups/:id",
  asyncHandler(async (req, res) => {
    const databaseId = Number(req.params.id);
    if (!Number.isInteger(databaseId) || databaseId <= 0) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const QUERY = gql`
      query GroupByDatabaseId($databaseId: ID!) {
        group(id: $databaseId, idType: DATABASE_ID) {
          databaseId
          title
          content
          uri
        }
      }
    `;

    try {
      const data = await wpClient(false).request(QUERY, { databaseId });
      if (!data?.group) return res.status(404).json({ error: "Not found" });
      res.json(data.group);
    } catch (err: any) {
      throw new UpstreamError("Upstream WPGraphQL error", err?.message ?? String(err));
    }
  })
);

/**
 * GET /api/groups/:id/people
 * Returns people in this group (your custom connection field on Group).
 */
router.get("/groups/:id/people", async (req, res) => {
  const databaseId = Number(req.params.id);
  if (!Number.isInteger(databaseId) || databaseId <= 0) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const first = clampFirst(req.query.first, 20);

  const QUERY = gql`
    query GroupPeople($databaseId: ID!, $first: Int!) {
      group(id: $databaseId, idType: DATABASE_ID) {
        databaseId
        title
        people(first: $first) {
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
    if (!data?.group) return res.status(404).json({ error: "Not found" });
    res.json(data.group.people.nodes);
  } catch (err: any) {
    throw new UpstreamError("Upstream WPGraphQL error", err?.message ?? String(err));
  }
});
