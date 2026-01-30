import { Router } from "express";
import { gql } from "graphql-request";
import { wpClient } from "../../wpgraphql.js";

export const router = Router();

router.get("/groups", async (req, res) => {
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
    res.status(502).json({
      error: "Upstream WPGraphQL error",
      detail: err?.message ?? String(err),
    });
  }
});
