import { Router } from "express";
import { createNewUser } from "../controllers/users";

const router = Router();

router.post("/user", createNewUser);

export const userRoutes = router;
