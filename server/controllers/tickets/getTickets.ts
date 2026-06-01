import type { Request, Response } from "express";

import { tickets } from "../../services/ticketService";

export const getTickets = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const arrTickets = await tickets();

  res.status(200).json(arrTickets);
};
