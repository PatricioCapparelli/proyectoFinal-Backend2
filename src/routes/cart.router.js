import { Router } from "express";
import {
    finalizarCompra,
    getCart,
    getCartById,
    createCart,
    addProduct,
 } from "../controllers/cart.controller.js";

const router = Router();

router.post('/:cid/purchase', finalizarCompra);

router.get('/', getCart);

router.post('/:cid', getCartById);

router.post('/', createCart);

router.post('/:pid/product', addProduct);

export default router;
