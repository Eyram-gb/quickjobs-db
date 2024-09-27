import { Router } from "express";
import {
  getEmployerApplications,
  newApplication,
  updateApplicationStatus,
} from "../controllers/applications";

const router = Router();

router.post("/applications", newApplication);
router.get(`/applications/employer/:id`, getEmployerApplications);
router.put('/applications/:id', updateApplicationStatus)

export const applicationsRoutes = router;
