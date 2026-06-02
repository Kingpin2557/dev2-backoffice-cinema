import type { Model } from "../routes";

export interface TicketProto extends Record<string, unknown> {
  customerId: number;
  seatId: number;
  showtimeId: number;
  purchaseDate: Date;
  price: number;
}

export interface Ticket extends TicketProto {
  id: number;
}

export interface TicketModel extends Model<TicketProto, Ticket, number> {}
