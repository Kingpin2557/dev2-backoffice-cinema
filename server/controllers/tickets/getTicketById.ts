import type { Request, Response } from "express";

import { ticketById } from "../../services/ticketService";

export const getTicketById = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const ticket = await ticketById(res.locals.numericId as string);

  if (!ticket) {
    res.status(404).json({ error: "ticket not found" });
    return;
  }
  res.status(200).json(ticket);
};
