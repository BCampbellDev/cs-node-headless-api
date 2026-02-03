import { wpClient } from "../../wpgraphql.js";

const UPSERT_NPS_ALERT = /* GraphQL */ `
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
        editorLock
      }
    }
  }
`;

export async function upsertNpsAlertToWordPress(input: {
  npsId: string;
  parkCode?: string;
  category?: string;
  sourceUrl?: string;
  lastIndexedDate?: string;
  relatedRoadEventsJson?: string;
  title?: string;
  content?: string;
  excerpt?: string;
  status?: "draft" | "publish";
}) {
  const client = wpClient(true);
  return client.request(UPSERT_NPS_ALERT, { input });
}
