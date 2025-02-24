import CartService from '../DAO/classes/cart.dao.js';

export const finalizarCompra = async (req, res) => {
  const { cid } = req.params;
  const { purchaserEmail } = req.body;

  if (!purchaserEmail) {
    return res.status(400).json({ message: 'Correo electrónico del comprador es necesario.' });
  }

  try {
    const result = await CartService.purchaseCart(cid, purchaserEmail);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}