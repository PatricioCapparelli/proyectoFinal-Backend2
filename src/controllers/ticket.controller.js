import Ticket from "../DAO/classes/tickets.dao.js";
import Cart from "../DAO/classes/cart.dao.js";
import ticketsDto from "../DAO/DTOs/ticket.js";
import cartsController from "../controllers/cart.controller.js";

const ticketService = new Ticket();
const cartsService = new Cart();


const findAll = async () => {
  const tickets = await ticketService.getAll();
  return tickets;
};

const findOneById = async (id) => {
  const ticket = await ticketService.getById(id);
  return ticket;
};

const updateOneById = async (id, newData) => {
  const ticketFound = await ticketService.getById(id);
  const { purchaser, amount } = newData;

  const updateTicket = {
    purchaser,
    amount,
  };

  const result = await ticketService.update(ticketFound._id, updateTicket);
  return result;
};

const createOne = async (cart) => {
  const cartFound = await cartsService.getById(cart);

  const ticket = {
    amount: cartFound.total,
    purchaser: cartFound.user,
  };

  const formattedTicket = new ticketsDto(ticket);

  const newTicket = await ticketService.create(formattedTicket);

  const deletingProducts = await cartsController.deleteAllProductsOnCart(cart);
  if (!deletingProducts)

  return newTicket;
};

const deleteOneById = async (id) => {
  const result = await ticketService.delete(id);
  return result;
};

export default {
  findAll,
  createOne,
  findOneById,
  deleteOneById,
  updateOneById,
};
