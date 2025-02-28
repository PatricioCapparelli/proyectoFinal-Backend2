import { Router } from "express";
import handlePolicies from "../middlewares/handle-policies.js";
import { loginUser, getUsers, getUserById, createUser } from "../controllers/users.controller.js";

const router = Router();

router.get("/all", /*authToken*/ getUsers);

router.post("/login" , loginUser);

router.get("/:uid", handlePolicies(["ADMIN", "USER"]), getUserById);

router.post("/register", createUser);

export default router;
