import Product from "../DAO/classes/products.dao.js";
import User from "../DAO/classes/users.dao.js";
import CartService from "../DAO/classes/cart.dao.js";
import { v4 as uuid } from "uuid";

const userService = new User();
const cartsService = new CartService();
const productService = new Product();

export const getProducts = async (req, res) => {
  try {
    const Products = await productService.getProducts();
    res.status(200).json({ status: "success", payload: Products });
  } catch (error) {
    return res.status(500).json({ status: "Error", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  const { oid } = req.params;
  try {
    const Product = await productService.getProductById(oid);
    res.status(200).json({ status: "success", payload: Product });
  } catch (error) {
    return res.status(500).json({ status: "Error", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  const { user, carts, products } = req.body;
  try {
    const userFound = await userService.getUserById(user);
    const cartsFound = await cartsService.getCartsById(carts);
    const actualProducts = cartsFound.products.filter((product) =>
      products.includes(product.id)
    );

    const totalPrice = actualProducts.reduce(
      (acc, prev) => (acc += prev.price),
      0
    );
    const Product = {
      number: uuid(),
      carts,
      user,
      status: "pending",
      products: actualProducts.map((product) => product.id),
      totalPrice,
    };
    const ProductResult = await productService.createProduct(Product);

    userFound.Products.push(ProductResult._id)
    await userService.updateUser(user,userFound)
    res.status(201).json({ status: "success", payload: ProductResult });
  } catch (error) {
    return res.status(500).json({ status: "Error", error: error.message });
  }
};

export const resolveProduct = async (req, res) => {
  res.status(201).json({ status: "success", payload: "ResolveProduct" });
};
