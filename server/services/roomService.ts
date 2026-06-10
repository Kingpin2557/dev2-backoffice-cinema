import sql from "./db";
import type { Room, SeatAvailability } from "../models/rooms";

export const roomQueries = {
  async get(id: number) {
    const data = await sql<Room[]>`
      SELECT * FROM "Room" WHERE id = ${id}
    `;
    return data[0] ?? null;
  },

  /**
   * Returns every seat in a room with its reservation status for a
   * specific showtime. A seat is considered reserved if:
   *   - Seat.isReserved is true (permanently out of service), OR
   *   - a Ticket already exists for that seat + showtime combination.
   */
  async getSeatsForShowtime(roomId: number, showtimeId: number) {
    const data = await sql<SeatAvailability[]>`
      SELECT
        s.id AS "seatId",
        (s."isReserved" OR t.id IS NOT NULL) AS "isReserved"
      FROM "Seat" s
      LEFT JOIN "Ticket" t
        ON t."seatId"     = s.id
        AND t."showtimeId" = ${showtimeId}
      WHERE s."roomId" = ${roomId}
      ORDER BY s.id
    `;
    return data ?? [];
  },
};
