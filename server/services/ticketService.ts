import sql from "../config/db";

export interface Ticket {
  id: number;
  customerId: number;
  seatId: number;
  showtimeId: number;
  purchaseDate: Date;
  price: number;
  type: string;
}

export async function tickets(): Promise<Ticket[]> {
  const data: Ticket[] = await sql<Ticket[]>`SELECT * FROM "Ticket"`;
  return data ?? null;
}

export async function ticketById(id: string): Promise<Ticket> {
  const data: Ticket[] = await sql<
    Ticket[]
  >`SELECT * FROM "Ticket" WHERE id = ${id} LIMIT 1`;
  return data[0] ?? null;
}

export async function ticketCreate(ticket: Ticket): Promise<Ticket> {
  const { customerId, seatId, showtimeId, purchaseDate, price, type } = ticket;

  const data: Ticket[] = await sql<
    Ticket[]
  >`INSERT INTO "Ticket" ("customerId", "seatId", "showtimeId", "purchaseDate", "price", "type")
         VALUES (${customerId}, ${seatId}, ${showtimeId}, ${purchaseDate}, ${price}, ${type})
         RETURNING *`;
  return data[0] ?? null;
}
