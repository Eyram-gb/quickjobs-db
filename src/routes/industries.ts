import { Router } from "express";
import { getAllIndustries } from "../controllers/industries";

const router = Router();

router.get("/industries", getAllIndustries);

export const industriesRoutes = router;
