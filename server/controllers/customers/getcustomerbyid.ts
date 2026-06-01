import type { Request, Response } from "express";

import { customerById } from "../../services/customerService";

export const getCustomerById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const movie = await customerById(req.params.id as string);

  if (!movie) {
    res.status(404).json({ error: "Movie not found" });
    return;
  }
  res.status(200).json(movie);
};
