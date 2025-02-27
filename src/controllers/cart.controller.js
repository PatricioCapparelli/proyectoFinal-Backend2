import CartService from '../DAO/classes/cart.dao.js';
const cart = new CartService();

export const finalizarCompra = async (req, res) => {
  const { cid } = req.params;
  const { purchaserEmail } = req.body;

  if (!purchaserEmail) {
    return res.status(400).json({ message: 'Correo electrónico del comprador es necesario.' });
  }

  try {
    const result = await cart.purchaseCart(cid, purchaserEmail);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const getCart = async (req, res) => {
    try {
      const Cart = await cart.getCart();
      !Cart
        ? res.status(404).json({ status: "not-found" })
        : res.status(200).json({ status: "success", payload: Cart });
    } catch (error) {
      return res.status(500).json({ status: "error", message: error.message });
    }
};

export const getCartById = async (req, res) => {
    const { bid } = req.params;
    try {
      const Cart = await cart.getCartById(bid);
      !Cart
        ? res.status(404).json({ status: "not-found" })
        : res.status(200).json({ status: "success", payload: Cart });
    } catch (error) {
      return res.status(500).json({ status: "error", message: error.message });
    }
};

export const createCart = async (req, res) => {
    const Cart = req.body;
    try {
      const newCart = await cart.createCart(Cart);
      res.status(200).json({ status: "success", payload: newCart });
    } catch (error) {
      return res.status(500).json({ status: "error", message: error.message });
    }
};

export const addProduct = async (req, res) => {
    const product = req.body;
    const { pid } = req.params;
    try {
      const Cart = await cart.purchaseCart(pid);

      Cart.products.push(product);

      await CartService.updateCart(Cart._id, Cart);
      res.status(200).json({ status: "success", payload: Cart });
    } catch (error) {
      return res.status(500).json({ status: "error", message: error.message });
    }
};
