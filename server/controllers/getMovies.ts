import type { Request, Response } from "express";
import type { Movie } from "../models/movies";

import { movieQueries } from "../services/moviesService";

export const getMovies = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const arrMovies = await movieQueries.getAll();

  res.status(200).json(arrMovies);
};

export const getMovieById = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const movie = await movieQueries.get(res.locals.numericId);

  if (!movie) {
    res.status(404).json({ error: "Movie not found" });
    return;
  }
  res.status(200).json(movie);
};

export const createMovie = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const movie = req.body as Movie;
  const created = await movieQueries.create(movie);

  res.status(201).json(created);
};
