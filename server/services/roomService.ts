import sql from "./db";
import type { Room, SeatAvailability } from "../models/rooms";

export const roomQueries = {
  async get(id: number) {
    const data = await sql<Room[]>`
      SELECT * FROM "Room" WHERE id = ${id}
    `;
    return data[0] ?? null;
  },

  async getLanguagesForRoom(roomId: number) {
    const data = await sql<{ id: number; name: string; display: string }[]>`
      SELECT DISTINCT l.id, l.name, l.display
      FROM languages l
      JOIN movie_languages ml ON ml."languageId" = l.id
      JOIN "Showtime" s ON s."movieId" = ml."movieId"
      WHERE s."roomId" = ${roomId}
      ORDER BY l.name
    `;
    return data ?? [];
  },

  async getFormatsForRoom(roomId: number) {
    const data = await sql<{ id: number; name: string }[]>`
      SELECT f.id, f.name
      FROM formats f
      JOIN "Room" r ON r."projectionFormatId" = f.id
      WHERE r.id = ${roomId}
    `;
    return data ?? [];
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
