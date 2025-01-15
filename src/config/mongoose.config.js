import { connect } from "mongoose";

export const connectDb = async () => {

    const mongodbUri = process.env.MONGO_DB_URI;
    try {
        await connect(mongodbUri);
        console.log("Conexion con la BD exitosa!");
    } catch (error) {
        console.log("No se pudo establecer la conexion con la BD", error);
    }
};