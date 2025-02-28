import { Schema, model } from "mongoose";

const ProductsSchema = new Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, trim: true, unique: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true, default: 0, min: 0 },
  stock: { type: Number, required: true, default: 0, min: 0 },
});

export default model("Products", ProductsSchema);
