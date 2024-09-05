import { Router } from "express";
import { newApplication } from "../controllers/applications";

const router = Router();

router.post("/applications", newApplication);

export const applicationsRoutes = router;