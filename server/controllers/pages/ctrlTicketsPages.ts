import { Request, Response } from "express";
import { ticketQueries } from "../../services/ticketService";

const LIMIT = 5;

export const getTickets = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const offset = (page - 1) * LIMIT;
    const [tickets, total] = await Promise.all([
      ticketQueries.getPaginated(LIMIT, offset),
      ticketQueries.getCount(),
    ]);
    const totalPages = Math.max(1, Math.ceil(total / LIMIT));
    res.render("tickets", { title: "Tickets", tickets, page, totalPages, error: null });
  } catch (err) {
    res.render("tickets", { title: "Tickets", tickets: [], page: 1, totalPages: 1, error: (err as Error).message });
  }
};

export const getEditTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const ticketId = parseInt(req.params.id as string);
    if (isNaN(ticketId)) { res.status(400).send("Invalid record identifier."); return; }
    const record = await ticketQueries.get(ticketId);
    if (!record) { res.status(404).send("The requested record could not be found."); return; }
    res.render("partials/_dynamic-form", { title: "Edit ticket", record, actionPath: `/tickets/${ticketId}/edit` });
  } catch {
    res.status(500).send("Internal Server Error processing layout compilation.");
  }
};

export const postEditTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const ticketId = parseInt(req.params.id as string, 10);
    if (isNaN(ticketId)) { res.status(400).send("Invalid record identifier."); return; }
    const updated = await ticketQueries.update({ ...req.body, id: ticketId });
    if (!updated) { res.status(404).send(`Failed to update ticket with id: ${ticketId}`); return; }
    req.app.get("io").emit("ticket:updated", updated);
    res.redirect("/tickets");
  } catch {
    res.status(500).send("Internal Server Error saving changes.");
  }
};

export const getAddTicket = async (_req: Request, res: Response): Promise<void> => {
  res.render("partials/_dynamic-form", {
    title: "Add ticket",
    record: { customerId: 0, seatId: 0, showtimeId: 0, purchaseDate: new Date().toISOString().slice(0, 10), price: 0, type: "adult" },
    actionPath: "/tickets/add",
  });
};

export const postAddTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const created = await ticketQueries.create(req.body);
    req.app.get("io").emit("ticket:created", created);
    res.redirect("/tickets");
  } catch {
    res.status(500).send("Internal Server Error saving changes.");
  }
};

export const deleteTicket = async (req: Request, res: Response): Promise<void> => {
  const ticketId = parseInt(req.params.id as string, 10);
  await ticketQueries.delete(ticketId);
  req.app.get("io").emit("ticket:deleted", ticketId);
  res.redirect("/tickets");
};
