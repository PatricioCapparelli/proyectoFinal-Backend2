import { Schema, model, SchemaTypes } from "mongoose";

const CartsSchema = new Schema({
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Products" },
      quantity: { type: Number, default: 1 },
    },
  ],
  total: { type: Number, default: 0 },
  user: { type: SchemaTypes.ObjectId, ref: "Users" },
});

export default model("Carts", CartsSchema);
