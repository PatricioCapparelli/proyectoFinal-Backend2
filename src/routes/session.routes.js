import { Router } from "express";
// 1
import userModel from "../models/users.model.js";
import { createHash } from "../utils/bcrypt.js";
//2
import passport from "passport";

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
    passport.authenticate('login', {
        failureRedirect: '/faillogin',
        successRedirect: '/profile'
    })
);

router.get("/faillogin", (req, res) => {
    res
        .status(400)
        .send({ status: "error", message: "Error al logear el usuario" });
});

// LOGOUT
router.post("/logout", async (req, res) => {
    const userSession = await req.session.user;
    console.log(userSession);
        try {
            req.session.destroy((err) => {
                if (!err) {
                    res.clearCookie('connect.sid');
                    res.redirect("/login");
                } else {
                    return res.status(500).json({ message: "Error al cerrar sesión", err: err.message });
                }
            });
        } catch (error) {
            res.status(500).send("error interno del servidor");
        }
    }
);

// USER
router.get("user/:id", async (req, res, next) => {
    const { id } = req.params;
    const userFound = await userModel.findById(id);

    try {
        if(userFound){
            res.status(200).json({ message: `Se encontro el usuario ${userFound} con exito!` });
        }
    } catch (error) {
            next(error);
    }
});

// RECUPERO
router.post('/recupero', async(req, res) => {
    const { email, password } = req.body;
    try {
        if(!email || !password) return res.status(400).send("campos requeridos");
        const userFound = await userModel.findOne({ email });

        const hashPass = createHash(password);
        userFound.password = hashPass;

        await userFound.save();
        res.redirect("/login");
    } catch (error) {

        res.status(500).send("error interno del servidor");
    }
})


export default router;
