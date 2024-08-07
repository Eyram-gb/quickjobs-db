import { Router } from "express";
import { loginUser, registerNewUser } from "../controllers/auth";

const router = Router();

router.post("/auth/register", registerNewUser);
router.post("/auth/login", loginUser);
router.post("/auth/logoout", registerNewUser);

export const authRoutes = router;
