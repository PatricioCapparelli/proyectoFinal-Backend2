import passport from "passport";
import local from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import User from "../DAO/classes/users.dao.js";
import { usersService } from "../repositories/index.js";

import jwt from "passport-jwt";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import usersModel from "../DAO/models/users.model.js";

const LocalStrategy = local.Strategy;
const jwtStrategy = jwt.Strategy;
const extractJwt = jwt.ExtractJwt;

const user = new User();

let usersServices;

const initializePassport = async () => {
    usersServices = usersService;

    passport.use(
        "register",
        new LocalStrategy(
            {
                passReqToCallback: true,
                usernameField: "email",
            },
            async (req, email, password, done) => {
                console.log("Registrando usuario:", req.body);
                const { nombre, apellido, edad, rol } = req.body;

                try {
                    const userFound = await usersModel.findOne({ email: username });
                    if (userFound) {
                        return done(null, false, { message: "El correo ya está registrado" });
                    }

                    const newUser = {
                        nombre,
                        apellido,
                        email,
                        edad,
                        rol: rol || "user",
                        contraseña: createHash(password),
                    };

                    const result = await usersServices.createUser(newUser);
                    return done(null, result);
                } catch (error) {
                    console.error("Error al crear el usuario:", error);
                    return done(error, false);
                }
            }
        )
    );

    passport.use("login", new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: "email",
        },
        async (req, username, password, done) => {
            try {
                const userFound = await usersModel.findOne({ email: username });
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
      }, async (accessToken, refreshToken, profile, done) => {
        try {
          const userFound = await usersService.getByEmail({ email: profile.emails[0]?.value });

          if (userFound) {

            userFound.googleAccessToken = accessToken;
            userFound.googleRefreshToken = refreshToken;
            await userFound.save();
            return done(null, userFound);
          }


          const newUser = {
            name: profile.name.givenName || "",
            last_name: profile.name.familyName || "",
            email: profile.emails[0]?.value || "",
            password: "",
            googleAccessToken: accessToken,
            googleRefreshToken: refreshToken,
          };

          const user = await user.createUser(newUser);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }));


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

export const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies.token;
    }
    return token;
  };

export default initializePassport;