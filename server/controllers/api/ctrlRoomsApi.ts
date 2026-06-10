import { Request, Response } from "express";
import { roomQueries } from "../../services/roomService";

export const getSeatsForShowtime = async (req: Request, res: Response): Promise<void> => {
  try {
    const roomId = parseInt(req.params.roomId as string);
    const showtimeId = parseInt(req.params.showtimeId as string);

    if (!Number.isInteger(roomId) || roomId <= 0 || !Number.isInteger(showtimeId) || showtimeId <= 0) {
      res.status(400).json({ error: "Invalid room ID or showtime ID" });
      return;
    }

    const seats = await roomQueries.getSeatsForShowtime(roomId, showtimeId);
    res.status(200).json(seats);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};
