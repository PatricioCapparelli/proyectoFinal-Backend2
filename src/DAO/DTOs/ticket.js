import generateTicket from "../../utils/generateTicket.js";

export default class Ticket {
  constructor(ticket) {
    this.code = generateTicket();
    this.purchase_datetime;
    this.amount = Number(ticket.amount);
    this.purchaser = ticket.purchaser;
  }
}
