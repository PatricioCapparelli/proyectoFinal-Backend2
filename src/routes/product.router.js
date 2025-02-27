import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  resolveProduct,
} from "../controllers/products.controller.js";
const router = Router();

router.get("/", getProducts);
router.get("/:oid", getProductById);
router.post("/", createProduct);
router.put("/:oid/resolve", resolveProduct);

export default router;
