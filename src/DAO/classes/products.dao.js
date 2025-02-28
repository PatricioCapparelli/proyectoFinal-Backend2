import ProductModel from "../models/products.model.js";
import ProductDTO from "../DTOs/product.dto.js"

export default class Product {
  getProducts = async () => {
    try {
      const Product = await ProductModel.find();
      return Product;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getProductById = async (id) => {
    try {
      const Product = await ProductModel.findOne({ _id: id });
      return Product;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  createProduct = async (Product) => {
    try {
      const result = await ProductModel.create(Product);
      const product = await ProductDTO(result);
      return product;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getByCode = async (code) => {
    try {
      const product = await ProductModel.findOne({ code });
      return product;
    } catch (e) {
      throw new Error("Fail getting product by code");
    }
  };

  resolveProduct = async (id, Product) => {
    try {
      const result = await ProductModel.updateOne({ _id: id }, { $set: Product });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
