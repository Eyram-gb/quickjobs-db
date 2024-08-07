import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateApplicantProfile,
  updateEmployerProfile,
  createApplicantProfile,
  createEmployerProfile,
} from "../controllers/users";

const router = Router();

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users/applicant", createApplicantProfile);
router.post("/users/employer", createEmployerProfile);
router.put("/users/applicant/:id", updateApplicantProfile);
router.put("/users/employer/:id", updateEmployerProfile);
export const userRoutes = router;
