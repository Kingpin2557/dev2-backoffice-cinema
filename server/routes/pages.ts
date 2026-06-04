import express, { Request, Response } from "express";
import { movieQueries } from "../services/moviesService";
import { customerQueries } from "../services/customerService";
import { ticketQueries } from "../services/ticketService";

const router = express.Router();
const LIMIT = 5;

router.get("/", (_req, res) => res.redirect("/movies"));

router.get("/movies", async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const offset = (page - 1) * LIMIT;
    const [movies, total] = await Promise.all([
      movieQueries.getPaginated(LIMIT, offset),
      movieQueries.getCount(),
    ]);
    const totalPages = Math.max(1, Math.ceil(total / LIMIT));
    const emptyRows = LIMIT - movies.length;
    res.render("movies", {
      title: "Movies",
      movies,
      page,
      totalPages,
      emptyRows,
      error: null,
    });
  } catch (err) {
    res.render("movies", {
      title: "Movies",
      movies: [],
      page: 1,
      totalPages: 1,
      emptyRows: LIMIT,
      error: (err as Error).message,
    });
  }
});

router.get("/customers", async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const offset = (page - 1) * LIMIT;
    const [customers, total] = await Promise.all([
      customerQueries.getPaginated(LIMIT, offset),
      customerQueries.getCount(),
    ]);
    const totalPages = Math.max(1, Math.ceil(total / LIMIT));
    const emptyRows = LIMIT - customers.length;
    res.render("customers", {
      title: "Customers",
      customers,
      page,
      totalPages,
      emptyRows,
      error: null,
    });
  } catch (err) {
    res.render("customers", {
      title: "Customers",
      customers: [],
      page: 1,
      totalPages: 1,
      emptyRows: LIMIT,
      error: (err as Error).message,
    });
  }
});

router.get("/tickets", async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const offset = (page - 1) * LIMIT;
    const [tickets, total] = await Promise.all([
      ticketQueries.getPaginated(LIMIT, offset),
      ticketQueries.getCount(),
    ]);
    const totalPages = Math.max(1, Math.ceil(total / LIMIT));
    const emptyRows = LIMIT - tickets.length;
    res.render("tickets", {
      title: "Tickets",
      tickets,
      page,
      totalPages,
      emptyRows,
      error: null,
    });
  } catch (err) {
    res.render("tickets", {
      title: "Tickets",
      tickets: [],
      page: 1,
      totalPages: 1,
      emptyRows: LIMIT,
      error: (err as Error).message,
    });
  }
});

export default router;
