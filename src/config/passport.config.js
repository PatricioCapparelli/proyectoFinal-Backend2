import passport from "passport";
import local from "passport-local";
import { Strategy as GoogleStrategy} from "passport-google-oauth2";
import jwt from "passport-jwt";

import userModel from "../models/users.model.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";

const clientIdGoogle = '60180797130-kvboa55pbuvevli2q427lpfjhleeec0c.apps.googleusercontent.com';
const clientKey = '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';

const localStrategy = local.Strategy;
const jwtStrategy = jwt.Strategy;
const extractJwt = jwt.ExtractJwt;

const initializePassport = () => {

passport.use("register", new localStrategy(
    {
    passReqToCallback: true,
    usernameField:"email",
    },
    async(req, username, password, done) => {
        const { name, last_name, email, age, role } = req.body;
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
                age,
                role,
                password: createHash(password)
            };

            if(role) newUser.role = role;

            const user = await userModel.create(newUser);

            return done(null, user);
        } catch (error) {
            return done(`error al crear el usuario ${error}`, false);
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
            const userFound = await userModel.findOne({ email: username });
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

passport.use('jwt', new jwtStrategy({ jwtFromRequest: extractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: 'jwt-key'
 }, async (jwt_payload, done) => {
    try {
        return done(null, jwt_payload);
    } catch (error) {
        return done (error);
    }
 })
)

// GOOGLE

passport.use('google', new GoogleStrategy ({
    clientID: clientIdGoogle,
    clientSecret: clientKey,
    callbackURL: 'http://localhost:3000/auth/google/callback'
}, async(accesToken, refreshToken, profile, done) => {
    try {
        const userFound = await userModel.findOne({ email: profile.emails[0]?.value });
        if(userFound) {
            return done(null, userFound);
        }

        // en caso de que no existe, crea uno nuevo
        const newUser = {
            name: profile.name.givenName || "",
            last_name: profile.name.familyName || "",
            email: profile.emails[0]?.value || "",
            password: "",
        }
        const user = await userModel.create(newUser);
        return done(null, user);
    } catch (error) {
        return done(error);
    }
})
);

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

};

const cookieExtractor = req => {
    let token = null;
    if(req && req.cookies) {
        token = req.cookies['auth_token'];
    }
    return token;
};

export default initializePassport;