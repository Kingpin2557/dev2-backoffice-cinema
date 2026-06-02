import type { Model } from "./shared";

export interface TicketProto extends Record<string, unknown> {
  customerId: number;
  seatId: number;
  showtimeId: number;
  purchaseDate: Date;
  price: number;
  type: "cosy" | "adult" | "child" | "student";
}

export interface Ticket extends TicketProto {
  id: number;
}

export interface TicketModel extends Model<TicketProto, Ticket, number> {}
