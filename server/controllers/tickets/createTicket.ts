import type { Request, Response } from "express";
import { type Ticket } from "../../services/ticketService";

import { ticketCreate } from "../../services/ticketService";

export const createTicket = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const ticket = req.body as Ticket;
  const created = await ticketCreate(ticket);

  res.status(201).json(created);
};
