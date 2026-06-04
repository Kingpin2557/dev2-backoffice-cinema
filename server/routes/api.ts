import express from "express";
import { movieQueries } from "../services/moviesService";
import { customerQueries } from "../services/customerService";
import { ticketQueries } from "../services/ticketService";
import { idValidation } from "../middleware/idValidation";

const router = express.Router();

router.get("/movie", async (req, res) => {
  try {
    if (req.query.page || req.query.limit) {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, parseInt(req.query.limit as string) || 5);
      const offset = (page - 1) * limit;
      const [movies, total] = await Promise.all([
        movieQueries.getPaginated(limit, offset),
        movieQueries.getCount(),
      ]);
      res.status(200).json({ movies, total, page, totalPages: Math.ceil(total / limit) });
    } else {
      const movies = await movieQueries.getAll();
      res.status(200).json(movies);
    }
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/movie/:id", idValidation, async (_req, res) => {
  try {
    const movie = await movieQueries.get(res.locals.numericId);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.status(200).json(movie);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/movie", async (req, res) => {
  try {
    const created = await movieQueries.create(req.body);
    res.status(201).json(created);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/movie/:id", idValidation, async (req, res) => {
  try {
    const updated = await movieQueries.update({
      ...req.body,
      id: res.locals.numericId,
    });
    if (!updated) return res.status(404).json({ error: "Movie not found" });
    res.status(200).json(updated);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/movie/:id", idValidation, async (_req, res) => {
  try {
    const deleted = await movieQueries.delete(res.locals.numericId);
    if (!deleted) return res.status(404).json({ error: "Movie not found" });
    res.status(200).json(deleted);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/customer", async (req, res) => {
  try {
    if (req.query.page || req.query.limit) {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, parseInt(req.query.limit as string) || 5);
      const offset = (page - 1) * limit;
      const [customers, total] = await Promise.all([
        customerQueries.getPaginated(limit, offset),
        customerQueries.getCount(),
      ]);
      res.status(200).json({ customers, total, page, totalPages: Math.ceil(total / limit) });
    } else {
      const customers = await customerQueries.getAll();
      res.status(200).json(customers);
    }
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/customer/:id", idValidation, async (_req, res) => {
  try {
    const customer = await customerQueries.get(res.locals.numericId);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.status(200).json(customer);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/customer", async (req, res) => {
  try {
    const created = await customerQueries.create(req.body);
    res.status(201).json(created);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/customer/:id", idValidation, async (req, res) => {
  try {
    const updated = await customerQueries.update({
      ...req.body,
      id: res.locals.numericId,
    });
    if (!updated) return res.status(404).json({ error: "Customer not found" });
    res.status(200).json(updated);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/customer/:id", idValidation, async (_req, res) => {
  try {
    const deleted = await customerQueries.delete(res.locals.numericId);
    if (!deleted) return res.status(404).json({ error: "Customer not found" });
    res.status(200).json(deleted);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/ticket", async (req, res) => {
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
});

router.get("/ticket/:id", idValidation, async (_req, res) => {
  try {
    const ticket = await ticketQueries.get(res.locals.numericId);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });
    res.status(200).json(ticket);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/ticket", async (req, res) => {
  try {
    const created = await ticketQueries.create(req.body);
    res.status(201).json(created);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/ticket/:id", idValidation, async (req, res) => {
  try {
    const updated = await ticketQueries.update({
      ...req.body,
      id: res.locals.numericId,
    });
    if (!updated) return res.status(404).json({ error: "Ticket not found" });
    res.status(200).json(updated);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/ticket/:id", idValidation, async (_req, res) => {
  try {
    const deleted = await ticketQueries.delete(res.locals.numericId);
    if (!deleted) return res.status(404).json({ error: "Ticket not found" });
    res.status(200).json(deleted);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
