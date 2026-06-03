import type { Request, Response } from "express";
import type { Ticket } from "../models/tickets";
import { io } from "../app";

import { ticketQueries } from "../services/ticketService";

export const getTickets = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const arrTickets = await ticketQueries.getAll();

    if (!arrTickets || arrTickets.length === 0) {
      res.status(404).json({ error: "Tickets not found" });
      return;
    }

    res.status(200).json(arrTickets);
  } catch (err) {
    console.error("Failed to fetch tickets:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTicketById = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const ticket = await ticketQueries.get(res.locals.numericId);

    if (!ticket) {
      res.status(404).json({ error: "Ticket not found" });
      return;
    }

    res.status(200).json(ticket);
  } catch (err) {
    console.error(
      `Failed to fetch ticket with id: ${res.locals.numericId}`,
      err,
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createTicket = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const ticket = req.body as Ticket;

    if (!ticket || Object.keys(ticket).length === 0) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const created = await ticketQueries.create(ticket);

    io.emit("ticket:created", created);
    res.status(201).json(created);
  } catch (err) {
    console.error("Failed to create ticket:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteTicket = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const deleted = await ticketQueries.delete(res.locals.numericId);

    if (!deleted) {
      res.status(404).json({ error: "Ticket not found" });
      return;
    }

    io.emit("ticket:deleted", deleted);
    res.status(200).json(deleted);
  } catch (err) {
    console.error(
      `Failed to delete ticket with id: ${res.locals.numericId}`,
      err,
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateTicket = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const updated = await ticketQueries.update({
      ...(req.body as Partial<Ticket>),
      id: res.locals.numericId,
    });

    if (!updated) {
      res.status(404).json({ error: "Ticket not found" });
      return;
    }

    io.emit("ticket:updated", updated);
    res.status(200).json(updated);
  } catch (err) {
    console.error(
      `Failed to update ticket with id: ${res.locals.numericId}`,
      err,
    );
    res.status(500).json({ error: "Internal server error" });
  }
};
