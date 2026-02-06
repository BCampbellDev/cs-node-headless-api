import { Router } from "express";
import asyncHandler from "../../middleware/asyncHandler.js";
import { syncNpsAlerts, type SyncParams } from "../../services/npsAlertSyncService.js";

export const npsRouter = Router();

npsRouter.post(
  "/alerts/sync",
  asyncHandler(async (req, res) => {
    const parkCode =
      typeof req.query.parkCode === "string" && req.query.parkCode.length
        ? req.query.parkCode
        : undefined;

    const limitRaw =
      typeof req.query.limit === "string" ? Number.parseInt(req.query.limit, 10) : undefined;

    const limit = Number.isFinite(limitRaw) ? limitRaw : undefined;

    const params: SyncParams = {};
    if (parkCode) params.parkCode = parkCode;
    if (typeof limit === "number") params.limit = limit;

    const result = await syncNpsAlerts(params);
    res.json(result);
  })
);
