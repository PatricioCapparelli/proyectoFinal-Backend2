import { Router } from "express";

import passport from "passport";

import userModel from "../models/users.model.js";
import { createHash } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";

const router = Router();

// REGISTER
router.post("/register",
    passport.authenticate('register', {
        failureRedirect: 'failregister',
        successRedirect: '/login'
    }),
);

router.get("/failregister", (req, res) => {
    res
        .status(400)
        .send({ status: "error", message: "Error al registrar el usuario" });
});

// LOGIN
router.post("/login",
    passport.authenticate('login', { failureRedirect: '/faillogin', session: false }),
    (req, res) => {
        const token = generateToken(req.user);

        res.cookie('auth_token', token, {
            httpOnly: true,
            maxAge: 3600000,
        });
        res.redirect('/profile');
    }
);

router.get("/faillogin", (req, res) => {
    res.status(401).send({ status: "error", message: "Error al logear el usuario" });
});

//GOOGLE
router.get('/auth/google', passport.authenticate('google', {scope: ["email", 'profile']}));

// UNAUTHORIZED
router.get('/unauthorized', (req, res) => {
    res.status(401).json({
        status: 'error',
        message: 'No autorizado'
    });
});

// LOGOUT
router.post("/logout", (req, res) => {

    res.clearCookie('auth_token', {
        httpOnly: true,
    });

    res.redirect('/login');
});

// USER
router.get("user/:id", async (req, res, next) => {
    const { id } = req.params;
    const userFound = await userModel.findById(id);

    try {
        if (userFound) {
            res.status(200).json({ message: `Se encontro el usuario ${userFound} con exito!` });
        }
    } catch (error) {
        next(error);
    }
});

// RECUPERO
router.post('/recupero', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) return res.status(400).send("campos requeridos");
        const userFound = await userModel.findOne({ email });

        const hashPass = createHash(password);
        userFound.password = hashPass;

        await userFound.save();
        res.redirect("/login");
    } catch (error) {

        res.status(500).send("error interno del servidor");
    }
});



export default router;
