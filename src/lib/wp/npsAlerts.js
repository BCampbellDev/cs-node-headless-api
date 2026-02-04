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
export async function upsertNpsAlertToWordPress(input) {
    const client = wpClient(true);
    return client.request(UPSERT_NPS_ALERT, { input });
}
//# sourceMappingURL=npsAlerts.js.map