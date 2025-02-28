export default class ProductDTO {
    constructor(product) {
      this.name = product.name;
      this.code = product.code;
      this.description = product.description;
      this.price = product.price;
      this.stock = product.stock;
    }
}