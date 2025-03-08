import { Router } from "express";
import {
     renderLogin,
     getCurrentUser,
     recoverPass,
     error404,
     renderHome,
     renderRegister,
     renderCurrent,
     renderGoogle,
     callbackGoogle
 } from "../controllers/users.controller.js";
import { authToken } from "../utils/jwt.js";

const router = Router();

router.get("/login", renderLogin);

router.post("/current", getCurrentUser);

router.get("/current", authToken, renderCurrent);

router.get("/recover", recoverPass)

router.get("/", renderHome);

router.get("/register", renderRegister);

router.get('/auth/google', renderGoogle);

router.get('/auth/google/callback', callbackGoogle);

router.get("*", error404);


export default router;