import { Schema, model } from 'mongoose';

const cartSchema = new Schema({
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true }
  }],
});

const Cart = model('Cart', cartSchema);

export default Cart;