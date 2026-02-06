import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";
import { router as baseRouter } from "./routes/index.js";
import { router as apiRouter } from "./routes/api/index.js";
import { webhooksRouter } from "./routes/webhooks/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

export function createServer() {
  const app = express();

  // Allow your browser (Next.js on :3000) to call this API (Node on :4000)
  app.use(cors({ origin: true }));

  // Parse JSON request bodies (so req.body works on POST requests)
  app.use(express.json());

  // Mount routes
  app.use(baseRouter);
  app.use("/api", apiRouter);
  app.use("/webhooks", webhooksRouter);

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}
