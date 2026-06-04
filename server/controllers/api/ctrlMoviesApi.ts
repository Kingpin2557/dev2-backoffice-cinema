import { Request, Response } from "express";
import { movieQueries } from "../../services/moviesService";

export const getMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.query.page || req.query.limit) {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, parseInt(req.query.limit as string) || 5);
      const offset = (page - 1) * limit;
      const [movies, total] = await Promise.all([
        movieQueries.getPaginated(limit, offset),
        movieQueries.getCount(),
      ]);
      res.status(200).json({ movies, total, page, totalPages: Math.ceil(total / limit) });
    } else {
      const movies = await movieQueries.getAll();
      res.status(200).json(movies);
    }
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMovieById = async (_req: Request, res: Response): Promise<void> => {
  try {
    const movie = await movieQueries.get(res.locals.numericId);
    if (!movie) { res.status(404).json({ error: "Movie not found" }); return; }
    res.status(200).json(movie);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const created = await movieQueries.create(req.body);
    req.app.get("io").emit("movie:created", created);
    res.status(201).json(created);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await movieQueries.update({ ...req.body, id: res.locals.numericId });
    if (!updated) { res.status(404).json({ error: "Movie not found" }); return; }
    req.app.get("io").emit("movie:updated", updated);
    res.status(200).json(updated);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await movieQueries.delete(res.locals.numericId);
    if (!deleted) { res.status(404).json({ error: "Movie not found" }); return; }
    req.app.get("io").emit("movie:deleted", res.locals.numericId);
    res.status(200).json(deleted);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};
