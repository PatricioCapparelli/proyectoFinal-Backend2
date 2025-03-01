import { Router } from "express";
import {
    findAll,
    findOneById,
    updateOneById,
    createCart,
 } from "../controllers/cart.controller.js";

const router = Router();

router.get('/', findAll);

router.post('/:cid', findOneById);

router.put('/:id', updateOneById);

router.post('/', createCart);

export default router;
