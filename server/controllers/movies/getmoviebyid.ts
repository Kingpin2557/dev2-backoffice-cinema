import { Request, Response } from "express";

import { movieById } from "../../services/moviesService";

export const getMovieById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const movie = await movieById(req.params.id as string);

  if (!movie) {
    res.status(404).json({ error: "Movie not found" });
    return;
  }
  res.status(200).json(movie);
};
