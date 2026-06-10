import { Request, Response } from "express";
import { roomQueries } from "../../services/roomService";
import { handleError } from "../../middleware/handleError";

export const getLanguagesForRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const roomId = parseInt(req.params.id as string);
    if (!Number.isInteger(roomId) || roomId <= 0) {
      res.status(400).json({ error: "Invalid room ID" });
      return;
    }
    const languages = await roomQueries.getLanguagesForRoom(roomId);
    res.status(200).json(languages);
  } catch (error) {
    handleError(res, error);
  }
};

export const getFormatsForRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const roomId = parseInt(req.params.id as string);
    if (!Number.isInteger(roomId) || roomId <= 0) {
      res.status(400).json({ error: "Invalid room ID" });
      return;
    }
    const formats = await roomQueries.getFormatsForRoom(roomId);
    res.status(200).json(formats);
  } catch (error) {
    handleError(res, error);
  }
};

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
  } catch (error) {
    handleError(res, error);
  }
};
