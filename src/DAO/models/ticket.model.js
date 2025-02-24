import { Schema, model } from "mongoose";

const generateTicketCode = () => {
  return 'TICKET-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

const ticketSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      default: generateTicketCode,
    },
    purchase_datetime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: true,
    },
    purchaser: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Ticket = model('Ticket', ticketSchema);

export default Ticket;
