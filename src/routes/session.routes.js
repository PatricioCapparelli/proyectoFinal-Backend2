import { Router } from "express";
import userModel from "../models/users.model.js";
const router = Router();

router.post("/register", async (req, res) => {
    const { name, last_name, email, password } = req.body;

    try {
        const userExist = await userModel.findOne({ email: email });

        if (userExist) {
            return res.status(400).json({ message: `El usuario con el correo ${email} esta registrado` });
        }
        await userModel.create({
            name,
            last_name,
            email,
            password,
        });

        res.status(201).redirect("/login");
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", err: error.message });
    }
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const userExist = await userModel.findOne({ email: email });
        if (userExist) {
            if (userExist.password === password) {
                req.session.user = {
                    name: userExist.name,
                    last_name: userExist.last_name,
                    email: userExist.email,
                }
                res.redirect('/profile');
            } else {
                res.status(401).send("Contraseña invalida");
            }
        }

    } catch (error) {
        res
            .status(500)
            .json({ message: "Error interno del servidor", err: error.message });
    }
});

router.get("/logout", async (req, res) => {
    const userSession = await req.session.user;
    console.log(userSession);

    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: "Error al cerrar sesión", err: err.message });
            }

        res.redirect("/login");
        });
    } catch (error) {
        res.status(500).send("error interno del servidor");
    }
});


export default router;
