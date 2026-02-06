import { Router } from "express";
import { wpWebhooksRouter } from "./wordpress.js";

export const webhooksRouter = Router();

webhooksRouter.use("/wp", wpWebhooksRouter);
