import { Router } from "express";
import passport from "passport";

import { generateToken } from "../utils/jwt.js";
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
    res.render('login', { title: 'LOGIN' });
});

// RECUPERO
router.get("/recupero", (req, res) => {
    res.render("recupero", { title: "Recuperar pass" });
});

// CURRENT
router.get('/current',
    passport.authenticate('jwt', { session: false, failureRedirect: '/unauthorized' }),
    (req, res) => {
        const user = req.user.user;
        console.log(user);
        res.render('current', { title: 'CURRENT', user });
    }
);

// PROFILE
router.get("/profile", passport.authenticate("jwt", { session: false, failureRedirect: "/unauthorized" }), (req, res) => {
    const user = req.user.user;
    res.render("profile", { title: "PROFILE", user });
})


// GOOGLE
router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
        const token = generateToken(req.user);

        res.cookie('auth_token', token, {
            httpOnly: true,
            maxAge: 3600000,
        });

        res.redirect('/profile');
    }
);

// ERROR 404
router.get("/*", (req, res) => {
    res.render("404error", { title: "404" });
})


export default router;