import passport from "passport";
import local from "passport-local";
import userModel from "../models/users.model.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
passport.use("register", new LocalStrategy(
    {
    passReqToCallback: true,
    usernameField:"email",
    },
    async(req, username, password, done) => {
        const { name, last_name, email } = req.body;
        try {
            const userFound = await userModel.findOne({ email: username });
            if(userFound) {
                console.log("Usuario existente");
                return done(null, false);
            }
            const newUser = {
                name,
                last_name,
                email,
                password: createHash(password)
            };
            const user = await userModel.create(newUser);

            return done(null, user);
        } catch (error) {
            return done(`error al crear el usuario ${error}`, false);
        }
    }
));

passport.use("login", new LocalStrategy(
    {
        passReqToCallback: true,
        usernameField: "email",
    },
    async (req, username, password, done) => {
        try {
            console.log('Iniciando autenticación para:', username);
            const userFound = await userModel.findOne({ email: username });
            if (userFound) {
                const isValid = isValidPassword(password, userFound.password);
                if (isValid) {
                    req.session.user = {
                        name: userFound.name,
                        last_name: userFound.last_name,
                        email: userFound.email,
                    };
                    console.log('Usuario autenticado correctamente:', req.session.user); // Verifica que la sesión esté correctamente asignada
                    return done(null, userFound);
                } else {
                    return done(null, false, { message: 'Contraseña incorrecta' });
                }
            } else {
                return done(null, false, { message: 'Usuario no encontrado' });
            }
        } catch (error) {
            return done(`Error al crear el usuario: ${error}`, false);
        }
    }
));

passport.serializeUser( (user, done) => {
    done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
    try {
        const user = await userModel.findOne({ email });
        done(null, user);  // Recupera el usuario desde la base de datos
    } catch (error) {
        done(error, null);
    }
});

}

export default initializePassport;