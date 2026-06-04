import sql from "./db";
import type { Ticket, TicketProto } from "../models/tickets";

export const ticketQueries = {
  async getAll() {
    const data = await sql<Ticket[]>`
      SELECT * FROM "Ticket"
    `;
    return data ?? [];
  },

  async get(id: number) {
    const data = await sql<Ticket[]>`
      SELECT * FROM "Ticket" WHERE id = ${id}
    `;
    return data[0] ?? null;
  },

  async create(data: TicketProto) {
    const [newTicket] = await sql<Ticket[]>`
      INSERT INTO "Ticket" ("customerId", "seatId", "showtimeId", "purchaseDate", "price")
      VALUES (${data.customerId}, ${data.seatId}, ${data.showtimeId}, ${data.purchaseDate}, ${data.price})
      RETURNING *
    `;
    return newTicket;
  },

  async update(data: Partial<TicketProto> & { id: number }) {
    const { id, ...payload } = data;
    const result = await sql<Ticket[]>`
      UPDATE "Ticket"
      SET
        "customerId" = COALESCE(${payload.customerId ?? null}, "customerId"),
        "seatId" = COALESCE(${payload.seatId ?? null}, "seatId"),
        "showtimeId" = COALESCE(${payload.showtimeId ?? null}, "showtimeId"),
        "purchaseDate" = COALESCE(${payload.purchaseDate ?? null}, "purchaseDate"),
        "price" = COALESCE(${payload.price ?? null}, "price"),
        "type" = COALESCE(${payload.type ?? null}, "type")
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0] ?? null;
  },

  async delete(id: number) {
    const result = await sql<Ticket[]>`
      DELETE FROM "Ticket" WHERE id = ${id}
      RETURNING *
    `;
    return result[0] ?? null;
  },
};
