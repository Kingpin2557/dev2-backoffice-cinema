import type { Request, Response } from "express";

import { movies } from "../../services/moviesService";

export const getMovies = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const arrMovies = await movies();

  res.status(200).json(arrMovies);
};
