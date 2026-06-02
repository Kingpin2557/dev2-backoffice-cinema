import type { Request, Response } from "express";
import type { Ticket } from "../models/tickets";

import { ticketQueries } from "../services/ticketService";

export const getTickets = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const arrTickets = await ticketQueries.getAll();

  res.status(200).json(arrTickets);
};

export const getTicketById = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const ticket = await ticketQueries.get(res.locals.numericId);

  if (!ticket) {
    res.status(404).json({ error: "ticket not found" });
    return;
  }
  res.status(200).json(ticket);
};

export const createTicket = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const ticket = req.body as Ticket;
  const created = await ticketQueries.create(ticket);

  res.status(201).json(created);
};

export const deleteTicket = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const deleted = await ticketQueries.delete(res.locals.numericId);

  res.status(201).json(deleted);
};

export const updateTicket = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const updated = await ticketQueries.update({
    ...(req.body as Partial<Ticket>),
    id: res.locals.numericId,
  });

  if (!updated) {
    res.status(404).json({ error: "Ticket not found to update" });
    return;
  }
  res.status(200).json(updated);
};
