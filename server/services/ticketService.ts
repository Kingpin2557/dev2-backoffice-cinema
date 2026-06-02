import sql from "../config/db";
import type { TicketModel, Ticket, TicketProto } from "../models/tickets";

export const ticketQueries: TicketModel = {
  async getAll(): Promise<Ticket[]> {
    const data = await sql<Ticket[]>`
      SELECT * FROM "Ticket"
    `;
    return data ?? [];
  },

  async get(id: number): Promise<Ticket | null> {
    const data = await sql<Ticket[]>`
      SELECT * FROM "Ticket" WHERE id = ${id}
    `;
    return data[0] ?? null;
  },

  async create(data: TicketProto): Promise<Ticket> {
    const [newTicket] = await sql<Ticket[]>`
      INSERT INTO "Ticket" (customerId, "seatId", "showtimeId", purchaseDate, "price")
      VALUES (${data.customerId}, ${data.seatId}, ${data.showtimeId}, ${data.purchaseDate}, ${data.price})
      RETURNING *
    `;
    return newTicket;
  },

  async update(
    data: Partial<TicketProto> & { id: number },
  ): Promise<Ticket | null> {
    const { id, ...payload } = data;

    const result = await sql<Ticket[]>`
        UPDATE "Ticket"
        SET
          customerId = COALESCE(${payload.customerId ?? null}, customerId),
          "seatId" = COALESCE(${payload.seatId ?? null}, "seatId"),
          "showtimeId" = COALESCE(${payload.showtimeId ?? null}, "showtimeId"),
          purchaseDate = COALESCE(${payload.purchaseDate ?? null}, purchaseDate),
          "price" = COALESCE(${payload.price ?? null}, "price")
        WHERE id = ${id}
        RETURNING *
      `;

    return result[0] ?? null;
  },

  async delete(id: number): Promise<boolean> {
    const result = await sql`
      DELETE FROM "Ticket" WHERE id = ${id}
    `;
    return result.count > 0;
  },
};
