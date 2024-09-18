import { Router } from "express";
import {
  getEmployerApplications,
  newApplication,
} from "../controllers/applications";

const router = Router();

router.post("/applications", newApplication);
router.get(`/applications/employer/:id`, getEmployerApplications);

export const applicationsRoutes = router;
