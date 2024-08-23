import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  getAllApplicants,
  getApplicantById,
  getAllEmployers,
  getEmployerById,
  updateApplicantProfile,
  updateEmployerProfile,
  createApplicantProfile,
  createEmployerProfile,
} from "../controllers/users";
// import { Verify } from "../middleware/verify";

const router = Router();

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);

router.get("/users/applicants", getAllApplicants);
router.get("/users/applicants/:id", getApplicantById);
router.post("/users/applicants", createApplicantProfile);
router.put("/users/applicants/:id", updateApplicantProfile);

router.get("/users/employers", getAllEmployers);
router.get("/users/employers/:id", getEmployerById);
router.post("/users/employers", createEmployerProfile);
router.put("/users/employers/:id", updateEmployerProfile);
export const userRoutes = router;
