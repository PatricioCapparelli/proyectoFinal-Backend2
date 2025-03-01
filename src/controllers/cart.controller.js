import Cart from "../DAO/classes/cart.dao.js";
import Product from "../DAO/classes/products.dao.js";

const cartService = new Cart();
const productService = new Product();

export const findAll = async () => {
  const carts = await cartService.getAll();
  return carts;
};

export const findOneById = async (id) => {
  const cart = await cartService.getById(id);
  return cart;
};


export const findOneByIdPopulate = async (id) => {
  const cart = await cartService.getByIdPopulate(id);
  return cart;
};


export const updateOneById = async (id, newData) => {
  const cartFound = await cartService.getById(id);

  const { products, total } = newData;

  const updateCart = {
    products,
    total,
  };

  const result = await cartService.update(cartFound._id, updateCart);
  return result;
};

export const addOneProductToCartById = async (cartId, productId) => {
  const cartFound = await cartService.getById(cartId);

  const productFound = await productService.getById(productId);

  const productIndex = cartFound.products.findIndex(
    (item) => item.product.toString() === productId
  );

  if (productIndex !== -1) {
    const updatedProducts = cartFound.products.map((item, index) => {
      if (index === productIndex) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    cartFound.products = updatedProducts;
  } else {
    const newProduct = {
      product: productFound._id,
      quantity: Number(1),
    };
    cartFound.products.push(newProduct);
  }

  const cartTotal = cartFound.total + productFound.price;

  const result = await cartService.update(cartFound._id, {
    products: cartFound.products,
    total: cartTotal,
  });

  return result;
};

export const deleteOneProductOnCartById = async (cartId, productId) => {
  const cartFound = await cartService.getById(cartId);

  const productFound = await productService.getById(productId);

  const productIndex = cartFound.products.findIndex(
    (item) => item.product.toString() === productId
  );

  const cartTotal =
    cartFound.total -
    productFound.price * cartFound.products[productIndex].quantity;

  cartFound.products.splice(productIndex, 1);

  const result = await cartService.update(cartFound._id, {
    products: cartFound.products,
    total: cartTotal,
  });

  return result;
};

export const deleteAllProductsOnCart = async (cartId) => {
  const cartFound = await cartService.getById(cartId);

  cartFound.products = [];
  cartFound.total = Number(0);

  const result = await cartService.update(cartFound._id, cartFound);

  return result;
};

export const createCart = async (userId) => {
  const newCart = await cartService.create({ user: userId });
  return newCart;
};

export const deleteOneById = async (id) => {
  const result = await cartService.delete(id);
  return result;
};
