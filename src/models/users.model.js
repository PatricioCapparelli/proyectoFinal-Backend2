import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number
    },
    password: {
        type: String,
    },
    role:{
        type: String,
        default: "user",
        required: false
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: "carts",
    }
});

export default model("User", UserSchema);