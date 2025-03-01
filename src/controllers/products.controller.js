import Product from "../DAO/classes/products.dao.js";
import User from "../DAO/classes/users.dao.js";
import CartService from "../DAO/classes/cart.dao.js";
import ProductDTO from "../DAO/DTOs/product.dto.js";

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
}

export const createProduct = async (req, res) => {
  try {
    const { name, code, description, price, stock } = req.body;

    if (!name || !code) {
      return res.status(400).json({ error: 'Name and code are required' });
    }

    const formattedProduct = new ProductDTO({
      name,
      code,
      description,
      price,
      stock,
    });

    const newProduct = await productService.createProduct(formattedProduct);

    if (!newProduct) {
      return res.status(500).json({ error: 'Error creating product in the database' });
    }

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while creating product' });
  }
};



export const resolveProduct = async (req, res) => {
  res.status(201).json({ status: "success", payload: "ResolveProduct" });
};
