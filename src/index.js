import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/mongoose.config.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import paths from "./utils/path.js";
import cors from "cors";

import initializePassport  from "./config/passport.config.js";
import passport from "passport";


import userRoutes from "./routes/users.router.js";
import orderRoutes from "./routes/orders.router.js";
import businessRoutes from "./routes/business.router.js";

//settings

const app = express();

dotenv.config();

app.set("PORT", process.env.PORT);

const corsOptions = {
  origin: ["http://127.0.0.1:5500"],
  credentials: true
};

const secret = "myPass1234";

// middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use("/api/public", express.static(paths.public));
app.use(cookieParser());
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_DB_URI,
      ttl: 15,
    }),
    secret,
    resave: false,
    saveUninitialized: false,
  })
);

initializePassport()
app.use(passport.initialize());
app.use(passport.session())

//Routes


app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/business", businessRoutes);


//listeners

connectDb();

app.listen(app.get("PORT"), () => {
  console.log(`Server on port http://localhost:${app.get("PORT")}`);
});