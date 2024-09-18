import { Router } from "express";
import {
  createNewGig,
  deleteGig,
  getAllGigs,
  getEmployerGigs,
  getGigById,
  updateGig,
} from "../controllers/gigs";

const router = Router();

router.get("/gigs", getAllGigs);
router.get("/gigs/:id", getGigById);
router.get("/gigs/:id/employer", getEmployerGigs)
router.put("/gigs/:id", updateGig);
router.post("/gigs", createNewGig);
router.delete("/gigs/:id", deleteGig);

export const gigRoutes = router;
