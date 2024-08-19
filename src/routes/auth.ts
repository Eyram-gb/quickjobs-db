import { Router } from "express";
import { loginUser, registerNewUser } from "../controllers/auth";
import { Verify } from "../middleware/verify";

const router = Router();

router.post("/auth/register", registerNewUser);
router.post("/auth/login", Verify, loginUser);
router.post("/auth/logout", Verify, registerNewUser);

export const authRoutes = router;
