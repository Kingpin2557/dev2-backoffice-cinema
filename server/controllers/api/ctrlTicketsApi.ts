import { Request, Response } from "express";
import { ticketQueries } from "../../services/ticketService";

export const getTickets = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.query.page || req.query.limit) {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, parseInt(req.query.limit as string) || 5);
      const offset = (page - 1) * limit;
      const [tickets, total] = await Promise.all([
        ticketQueries.getPaginated(limit, offset),
        ticketQueries.getCount(),
      ]);
      res.status(200).json({ tickets, total, page, totalPages: Math.ceil(total / limit) });
    } else {
      const tickets = await ticketQueries.getAll();
      res.status(200).json(tickets);
    }
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTicketById = async (_req: Request, res: Response): Promise<void> => {
  try {
    const ticket = await ticketQueries.get(res.locals.numericId);
    if (!ticket) { res.status(404).json({ error: "Ticket not found" }); return; }
    res.status(200).json(ticket);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const created = await ticketQueries.create(req.body);
    req.app.get("io")?.emit("ticket:created", created);
    res.status(201).json(created);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await ticketQueries.update({ ...req.body, id: res.locals.numericId });
    if (!updated) { res.status(404).json({ error: "Ticket not found" }); return; }
    req.app.get("io")?.emit("ticket:updated", updated);
    res.status(200).json(updated);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await ticketQueries.delete(res.locals.numericId);
    if (!deleted) { res.status(404).json({ error: "Ticket not found" }); return; }
    req.app.get("io")?.emit("ticket:deleted", res.locals.numericId);
    res.status(200).json(deleted);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};
