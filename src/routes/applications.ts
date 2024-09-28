import { Router } from "express";
import {
  getClientApplications,
  getEmployerApplications,
  newApplication,
  updateApplicationStatus,
} from "../controllers/applications";

const router = Router();

router.post("/applications", newApplication);
router.get(`/applications/employer/:id`, getEmployerApplications);
router.get(`/applications/client/:id`, getClientApplications);
router.put("/applications/:id", updateApplicationStatus);

export const applicationsRoutes = router;
