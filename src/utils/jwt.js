import jwt from "jsonwebtoken";

const secret = "jwt-key"

export const generateToken = (user) => {
    return jwt.sign({ user }, secret, { expiresIn:"24h" });
};

export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).send({ error: "No autenticado" });
    const token = authHeader.split(' ')[1]

    console.log(token);
    jwt.verify(token, secret, (error, credentials) => {
        if(error) return res.status(403).send({ error: "No autorizado" });

        req.user = credentials.user
        next()
    });
};