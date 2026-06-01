import type { Request, Response } from "express";
import { type Movie } from "../../models/movie";

import { movieCreate } from "../../services/moviesService";

export const createMovie = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const movie = req.body as Movie;
  const created = await movieCreate(movie);

  res.status(201).json(created);
};
