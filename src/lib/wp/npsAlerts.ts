import { gql } from "graphql-request";
import { wpClient } from "../../wpgraphql.js";
import type { NpsAlert } from "../nps.js";

export type UpsertResult = {
  created: boolean;
  alertId: number;
  alert: {
    databaseId: number;
    title: string;
    npsId: string;
    npsParkCode: string;
    npsCategory: string;
    npsUrl: string;
    npsLastIndexedDate: string;
  };
};

const UPSERT = gql`
  mutation UpsertNpsAlert($input: UpsertNpsAlertInput!) {
    upsertNpsAlert(input: $input) {
      created
      alertId
      alert {
        databaseId
        title
        npsId
        npsParkCode
        npsCategory
        npsUrl
        npsLastIndexedDate
      }
    }
  }
`;

// Map NPS → your mutation input keys (match your working GraphiQL mutation)
function toWpInput(a: NpsAlert) {
  return {
    npsId: a.id,
    title: a.title,
    npsParkCode: a.parkCode,
    npsCategory: a.category,
    npsUrl: a.url,
    npsLastIndexedDate: a.lastIndexedDate,
    description: a.description,
    // Optional extras if your input type supports it:
    // relatedRoadEventsJson: JSON.stringify(a.relatedRoadEvents ?? []),
    // status: "publish",
  };
}

export async function upsertNpsAlert(alert: NpsAlert): Promise<UpsertResult> {
  const client = wpClient(true);

  const variables = { input: toWpInput(alert) };

  const res = await client.request<{ upsertNpsAlert: UpsertResult }>(UPSERT, variables);
  return res.upsertNpsAlert;
}
