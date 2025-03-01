import jwt from "jsonwebtoken";

const secret = process.env.SECRET_JWT;

export const generateToken = (user) => {
    return jwt.sign({ user }, secret, { expiresIn:"15m" });
};

export const authToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send({ error: "No autenticado" });
    }

    jwt.verify(token, secret, (error, credentials) => {
        if (error) {
            return res.status(403).send({ error: "No autorizado" });
        }

        req.user = credentials.user;
        next();
    });
};