import type { Request, Response } from "express";

import { customerById } from "../../services/customerService";

export const getCustomerById = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const movie = await customerById(res.locals.numericId as string);

  if (!movie) {
    res.status(404).json({ error: "Movie not found" });
    return;
  }
  res.status(200).json(movie);
};
