import Cart from './cart.model.js';
import TicketService from './tickets.dao.js';

class CartService {
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
}

export default new CartService();
