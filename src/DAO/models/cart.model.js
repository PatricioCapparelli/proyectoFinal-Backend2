import { Schema, model } from 'mongoose';

const cartSchema = new Schema({
  products: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true }
  }],
});

const Cart = model('Cart', cartSchema);

export default Cart;