import type { Request, Response } from "express";
import { movieCreate } from "../../services/moviesService";
import { type Movie } from "../../models/movie";

export const createMovie = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const movie = req.body as Movie;
  const created = await movieCreate(movie);

  res.status(201).json(created);
};
