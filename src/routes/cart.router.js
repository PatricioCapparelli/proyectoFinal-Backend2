import { Router } from "express";
import { finalizarCompra } from "../controllers/cart.controller.js";
const router = Router();

router.post('/:cid/purchase', finalizarCompra);

export default router;
