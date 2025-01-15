import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/mongoose.config.js";
import { config as configHandlebars } from "./config/handlebars.config.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";

import userRoutes from './routes/session.routes.js';
import viewRoutes from './routes/view.routes.js';
import paths from "./utils/path.js";

//settings

const app = express();

dotenv.config();

app.set("PORT", process.env.PORT);

configHandlebars(app);

const secret = "myPass1234";

// connect database

connectDb();

// middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/public", express.static(paths.public));
app.use(cookieParser());
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_DB_URI,
      // ttl: 15,
    }),
    secret,
    resave: false,
    saveUninitialized: false,
  })
);

//routes

app.get("/", (req, res) => {
  res.render("home", { title: "HOME" });
});

app.use('/api/sessions', userRoutes)
app.use('/', viewRoutes)

// errors

app.use((req, res, next) => {
  res.status(404).end()
});

//listeners
app.listen(app.get("PORT"), () => {
  console.log(`Server on port http://localhost:${app.get("PORT")}`);
});