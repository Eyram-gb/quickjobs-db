import { Router } from "express";
import {
  createNewGig,
  deleteGig,
  getAllGigs,
  getEmployerGigs,
  getGigById,
  updateGig,
  getIndustryGigsCount,
} from "../controllers/gigs";

const router = Router();

router.get("/gigs", getAllGigs);
router.get("/gigs/:id", getGigById);
router.get("/gigs/:id/employer", getEmployerGigs)
router.put("/gigs/:id", updateGig);
router.post("/gigs", createNewGig);
router.delete("/gigs/:id", deleteGig);
router.get("/gigs/industry/count", getIndustryGigsCount);

export const gigRoutes = router;
