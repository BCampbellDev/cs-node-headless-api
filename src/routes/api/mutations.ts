import { Router } from "express";
import { gql } from "graphql-request";
import { wpClient } from "../../wpgraphql.js";

import asyncHandler from "../../middleware/asyncHandler.js";
import { UpstreamError, HttpError } from "../../errors.js";

export const router = Router();

router.post(
  "/groups/:groupId/people/:personId",
  asyncHandler(async (req, res) => {
    // 1) Parse & validate URL params
    const groupId = Number(req.params.groupId);
    const personId = Number(req.params.personId);

    if (!Number.isInteger(groupId) || groupId <= 0) {
      return res.status(400).json({ error: "Invalid groupId" });
    }

    if (!Number.isInteger(personId) || personId <= 0) {
      return res.status(400).json({ error: "Invalid personId" });
    }

    // 2) Define the GraphQL mutation
    const MUTATION = gql`
      mutation AddPersonToGroup($personId: Int!, $groupId: Int!) {
        addPersonToGroup(input: { personId: $personId, groupId: $groupId }) {
          added
          groupIds
          person {
            databaseId
            title
          }
        }
      }
    `;

    try {
      // 3) Call WPGraphQL using an authenticated client
      const data = await wpClient(true).request(MUTATION, { personId, groupId });

      // 4) Return a clean JSON response to the caller
      res.json({
        ok: true,
        result: data.addPersonToGroup,
      });
    } catch (err: any) {
      throw new UpstreamError("Upstream WPGraphQL error", err?.message ?? String(err));
    }
  })
);
