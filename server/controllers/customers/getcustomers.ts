import type { Request, Response } from "express";

import { customers } from "../../services/customerService";

export const getCustomers = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const movie = await customers();

  if (!movie) {
    res.status(404).json({ error: "Movie not found" });
    return;
  }
  res.status(200).json(movie);
};
