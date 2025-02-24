import dotenv from "dotenv";
dotenv.config();

export const port = process.env.PORT;
export const mongodb_url = process.env.MONGO_DB_URI;
export const client_google_id = process.env.SECRET_CLIENT_ID_GOOGLE;
export const client_key = process.env.SECRET_CLIENT_KEY;
export const persistence = process.env.PERSISTENCE;


