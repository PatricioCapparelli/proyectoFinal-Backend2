import passport from "passport";
import local from "passport-local";
import { Strategy as GoogleStrategy} from "passport-google-oauth2";

import jwt from "passport-jwt";
import { client_google_id, client_key } from "../config/env.js"
import Users from "../DAO/classes/users.dao.js"
import { createHash, isValidPassword } from "../utils/bcrypt.js";

const clientIdGoogle = client_google_id;
const clientKey = client_key;

const localStrategy = local.Strategy;
const jwtStrategy = jwt.Strategy;
const extractJwt = jwt.ExtractJwt;

const user = new Users();

const initializePassport = () => {

passport.use("register", new localStrategy(
    {
    passReqToCallback: true,
    usernameField:"email",
    },
    async(req, username, password, done) => {
        const { name, last_name, email, age, role } = req.body;
        try {
            const userFound = await user.getUserByMail({ email: username });
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

            const user = await user.createUser(newUser);

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
        const userFound = await user.getUserByGoogle({ email: profile.emails[0]?.value });
        if(userFound) {
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

passport.serializeUser( (user, done) => {
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
    if(req ?? req.cookies) {
        token = req.cookies['auth_token'];
    }
    return token;
};

export default initializePassport;