import { Request, Response } from "express";
import { showtimeQueries } from "../../services/showtimeService";

export const getShowtimes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const showtimes = await showtimeQueries.getAll();
    res.status(200).json(showtimes);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getShowtimeById = async (_req: Request, res: Response): Promise<void> => {
  try {
    const showtime = await showtimeQueries.get(res.locals.numericId);
    if (!showtime) { res.status(404).json({ error: "Showtime not found" }); return; }
    res.status(200).json(showtime);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createShowtime = async (req: Request, res: Response): Promise<void> => {
  try {
    const created = await showtimeQueries.create(req.body);
    res.status(201).json(created);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateShowtime = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await showtimeQueries.update({ ...req.body, id: res.locals.numericId });
    if (!updated) { res.status(404).json({ error: "Showtime not found" }); return; }
    res.status(200).json(updated);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteShowtime = async (_req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await showtimeQueries.delete(res.locals.numericId);
    if (!deleted) { res.status(404).json({ error: "Showtime not found" }); return; }
    res.status(200).json(deleted);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

// --- Kiosk endpoints ---

export const getPlayingMovies = async (_req: Request, res: Response): Promise<void> => {
  try {
    const movies = await showtimeQueries.getPlayingMovies();
    res.status(200).json(movies);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUniqueDates = async (_req: Request, res: Response): Promise<void> => {
  try {
    const dates = await showtimeQueries.getUniqueDates();
    res.status(200).json(dates);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getShowtimesForMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const movieId = parseInt(req.params.movieId as string);
    if (!Number.isInteger(movieId) || movieId <= 0) {
      res.status(400).json({ error: "Invalid movie ID" });
      return;
    }
    const showtimes = await showtimeQueries.getShowtimesForMovie(movieId);
    res.status(200).json(showtimes);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};
