import { Schema, model } from "mongoose";
import generateTicketCode from "../../utils/generateTicket.js"

const TicketsSchema = new Schema({
  code: { type: String, unique: true, required: true },
  purchase_datetime: {
    type: Date,
    default: generateTicketCode(),
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
});

const Ticket = model('Ticket', TicketsSchema);

export default Ticket;
