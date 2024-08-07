import { Router } from "express";
import { createNewUser } from "../controllers/users";

const router = Router();

router.post("/", createNewUser);

export const userRoutes = router;
