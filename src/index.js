import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDb } from "./config/mongoose.config.js";
import { config as configHandlebars } from "./config/handlebars.config.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import paths from "./utils/path.js";
import cors from "cors";

import initializePassport from "./config/passport.config.js";
import passport from "passport";

import userRoutes from "./routes/users.router.js";
import productRoutes from "./routes/product.router.js";
import cartRoutes from "./routes/cart.router.js";
import viewRoutes from "./viewRoutes/users.view.routes.js";
import { callbackGoogle } from "./controllers/users.controller.js";

// Settings
const app = express();
app.set("PORT", process.env.PORT || 8080);

configHandlebars(app);

const corsOptions = {
  origin: ["http://127.0.0.1:5500"],
  credentials: true,
};

const secret = process.env.SECRET_PASSWORD;

connectDb();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use("/api/public", express.static(paths.public));
app.use(express.static(paths.front));

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


initializePassport();
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use("/auth/google/callback", callbackGoogle)
app.use("/api/views", viewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// Listeners
app.listen(app.get("PORT"), () => {
    console.log(`Server on port http://localhost:${app.get("PORT")}`);
});

