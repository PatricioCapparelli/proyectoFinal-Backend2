import { Router } from "express";
import passport from "passport";

const router = Router();

// HOME
router.get("/", (req, res) => {
    res.render("home", { title: "HOME" });
  });

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
    const user  = { ...req.user }
    res.render("profile", { title: "PROFILE", user: user._doc });
});

// GOOGLE
router.get("/auth/google/callback", passport.authenticate("google", {
    successRedirect:"/profile",
    failureRedirect:"/login"
}))

// RECUPERO
router.get("/recupero", (req, res) => {
    res.render("recupero", { title: "Recuperar pass" });
});

export default router;