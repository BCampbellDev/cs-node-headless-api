import { Router } from "express";
import { router as resourcesRouter } from "./resources.js";
import { router as groupsRouter } from "./groups.js";
import { router as peopleRouter } from "./people.js";
import { router as mutationsRouter } from "./mutations.js";
export const router = Router();
router.use(resourcesRouter);
router.use(groupsRouter);
router.use(peopleRouter);
router.use(mutationsRouter);
//# sourceMappingURL=index.js.map