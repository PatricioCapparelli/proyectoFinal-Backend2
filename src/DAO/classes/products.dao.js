import ProductModel from "../models/products.model.js";

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
      return result;
    } catch (error) {
      console.log(error);
      return null;
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
