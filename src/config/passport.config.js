import passport from "passport";
import local from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import User from "../dao/classes/users.dao.js";

import jwt from "passport-jwt";
import { createHash, isValidPassword } from "../utils/bcrypt.js";

const localStrategy = local.Strategy;
const jwtStrategy = jwt.Strategy;
const extractJwt = jwt.ExtractJwt;

const user = new User();

const initializePassport = () => {

passport.use("register", new localStrategy(
        {
            passReqToCallback: true,  // Para acceder a req.body
            usernameField: "email",   // El campo de correo electrónico es usado como 'username'
        },
        async (req, username, password, done) => {
            const { name, last_name, email, age, role } = req.body;
            try {
                const userFound = await user.getUserByMail({ email: username });

                if (userFound) {
                    console.log("Usuario ya existe con el correo:", username);
                    return done(null, false, { message: 'El correo ya está registrado' });
                }

                // Crear un nuevo usuario
                const newUser = {
                    name,
                    last_name,
                    email,
                    age,
                    role,
                    password: createHash(password),  // Hashear la contraseña
                };

                if (role) newUser.role = role;  // Establecer el rol si se proporciona

                // Crear el usuario en la base de datos
                const createdUser = await user.createUser(newUser);

                // Retornar el usuario creado
                return done(null, createdUser);
            } catch (error) {
                console.error("Error al crear el usuario:", error);  // Registrar el error en consola
                return done(error, false);  // Pasar el error correctamente
            }
        }
));


    passport.use("login", new localStrategy(
        {
            passReqToCallback: true,
            usernameField: "email",
        },
        async (req, username, password, done) => {
            try {
                const userFound = await user.getUserByMail({ email: username });
                if (userFound) {
                    const isValid = isValidPassword(password, userFound.password);
                    if (isValid) {
                        req.session.user = {
                            name: userFound.name,
                            last_name: userFound.last_name,
                            email: userFound.email,
                        };

                        const user = userFound._doc;
                        delete user.password;
                        console.log('Usuario autenticado correctamente:', user);

                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Contraseña incorrecta' });
                    }
                } else {
                    return done(null, false, { message: 'Usuario no encontrado' });
                }
            } catch (error) {
                return done(`Error al logear el usuario: ${error}`, false);
            }
        }
    ));

    passport.use('jwt', new jwtStrategy({
        jwtFromRequest: extractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: 'jwt-key'
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    })
    )

    // GOOGLE

    passport.use('google', new GoogleStrategy({
        clientID: process.env.SECRET_CLIENT_ID_GOOGLE,
        clientSecret: process.env.SECRET_CLIENT_KEY,
        callbackURL: 'http://localhost:3000/auth/google/callback'
    }, async (accesToken, refreshToken, profile, done) => {
        try {
            const userFound = await user.getUserByGoogle({ email: profile.emails[0]?.value });
            if (userFound) {
                return done(null, userFound);
            }

            const newUser = {
                name: profile.name.givenName || "",
                last_name: profile.name.familyName || "",
                email: profile.emails[0]?.value || "",
                password: "",
            }
            const user = await user.createUser(newUser);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    })
    );

    passport.serializeUser((user, done) => {
        done(null, user.email);
    });

    passport.deserializeUser(async (email, done) => {
        try {
            const user = await user.getUserByMail({ email });
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });

};

const cookieExtractor = req => {
    let token = null;
    if (req ?? req.cookies) {
        token = req.cookies['auth_token'];
    }
    return token;
};

export default initializePassport;