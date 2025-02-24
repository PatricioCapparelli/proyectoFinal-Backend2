import TicketService from './ticket.service.js';

export const createTickets = async (req, res) => {
  const { purchaserEmail, totalAmount } = req.body;
  try {
    const newTicket = await TicketService.createTicket(purchaserEmail, totalAmount);
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el ticket", error: error.message });
  }
}

export const getAllTickets = async (req, res) => {
  try {
    const tickets = await TicketService.getAllTickets();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los tickets", error: error.message });
  }
}

export default router;
