import Cart from '../models/cart.model.js';
import TicketService from './tickets.dao.js';

export default class CartService {
  async purchaseCart(cartId, purchaserEmail) {
    try {
      const cart = await Cart.findById(cartId).populate('products.productId');
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const insufficientStockProducts = [];
      const productsToUpdate = [];
      const productsPurchased = [];

      let totalAmount = 0;

      for (let item of cart.products) {
        const product = item.productId;
        const requestedQuantity = item.quantity;

        if (product.stock >= requestedQuantity) {
          product.stock -= requestedQuantity;
          productsToUpdate.push(product);
          productsPurchased.push(item);
          totalAmount += product.price * requestedQuantity;
        } else {
          insufficientStockProducts.push(product.name);
        }
      }


      if (insufficientStockProducts.length > 0) {

        cart.products = cart.products.filter(item => insufficientStockProducts.includes(item.productId.name));
        await cart.save();
        throw new Error(`Stock insuficiente para los productos: ${insufficientStockProducts.join(', ')}`);
      }

      await Promise.all(productsToUpdate.map(product => product.save()));

      const ticket = await TicketService.createTicket(purchaserEmail, productsPurchased, totalAmount);

      cart.products = cart.products.filter(item => insufficientStockProducts.includes(item.productId.name));
      await cart.save();

      return { message: 'Compra realizada con éxito', ticket };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  getCart = async () => {
    try {
      const cart = await Cart.find();
      return cart;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  createCart = async (cart) => {
    try {
      const cart = await Cart.create(cart);
      return cart;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  updateCart = async (id) => {
    try {
      const result = await Cart.updateOne({ _id: id }, { $set: Cart });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  getCartById = async (id) => {
    try {
      const result = await Cart.findById({ _id: id });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

};

