import { Router } from "express";

const router = Router();

// REGISTER
router.get("/register", (req, res) => {
    res.render("register", { title: "REGISTER" });
});
// LOGIN
router.get("/login", (req, res) => {
    res.render("login", { title: "LOGIN" });
});
// PROFILE
router.get("/profile", (req, res) => {
    res.render("profile", { title: "PROFILE", user: req.session?.user });
});
// RECUPERO
router.get("/recupero", (req, res) => {
    res.render("recupero", { title: "Recuperar pass" });
});
export default router;