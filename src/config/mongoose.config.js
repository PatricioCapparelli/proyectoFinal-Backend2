import { connect } from "mongoose";
import { mongodb_url } from "./env.js";

export const connectDb = async () => {

    const mongodbUri = mongodb_url;
    try {
        await connect(mongodbUri);
        console.log("Conexion con la BD exitosa!");
    } catch (error) {
        console.log("No se pudo establecer la conexion con la BD", error);
    }
};

