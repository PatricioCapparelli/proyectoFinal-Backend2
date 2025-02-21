import { Router } from "express";
import handlePolicies from "../middlewares/handle-policies.js";
import { loginUser, getUsers, getUserById, createUser, getCurrentUser } from "../controllers/users.controller.js";
import { authToken } from "../utils/jwt.js";

const router = Router();

router.get("/",authToken, getUsers);

router.get("/login",authToken, loginUser);

router.get("/:uid", handlePolicies(["ADMIN", "USER"]), getUserById);

router.post("/register", createUser);

router.get("/current", authToken, handlePolicies(["ADMIN", "USER"]), getCurrentUser);

export default router;
