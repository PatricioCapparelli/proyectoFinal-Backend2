import { Router } from "express";
import handlePolicies from "../middlewares/handle-policies.js";
import { getUsers, getUserById, createUser, getCurrentUser } from "../controllers/users.controller.js";

const router = Router();

router.get("/", authenticate, handlePolicies(["ADMIN"]), getUsers);

router.get("/:uid", authenticate, handlePolicies(["ADMIN", "USER"]), getUserById);

router.post("/", authenticate, handlePolicies(["ADMIN"]), createUser);

router.get("/current", authenticate, handlePolicies(["ADMIN", "USER"]), getCurrentUser);

export default router;
