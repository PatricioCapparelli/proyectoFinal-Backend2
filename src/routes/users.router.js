import { Router } from "express";
import {handlePolice} from "../middlewares/handle-policies.js";
import { loginUser, getUsers, getUserById, createUser } from "../controllers/users.controller.js";

const router = Router();

router.get("/all", handlePolice(["admin"]), getUsers);

router.post("/login" , loginUser);

router.get("/:uid", handlePolice(["admin", "user"]), getUserById);

router.post("/register", createUser);

export default router;
