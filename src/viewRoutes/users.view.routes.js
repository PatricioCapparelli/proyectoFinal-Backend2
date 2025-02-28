import { Router } from "express";
import { renderLogin, getCurrentUser, recoverPass } from "../controllers/users.controller.js";

const router = Router();

router.get("/api/users/login", renderLogin);

router.get("/current", getCurrentUser);

router.get("/recover", recoverPass)

export default router;