import express, { Request, Response } from "express";
import { movieQueries } from "../services/moviesService";
import { customerQueries } from "../services/customerService";
import { ticketQueries } from "../services/ticketService";

const router = express.Router();

router.get("/", (_req, res) => res.redirect("/movies"));

router.get("/movies", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    const all = await movieQueries.getAll();
    const movies = all.slice(offset, offset + limit);
    const totalPages = Math.ceil(all.length / limit);

    res.render("movies", {
      movies,
      page,
      totalPages,
      error: null,
      title: "Movies",
    });
  } catch (err) {
    res.render("movies", {
      title: "Movies",
      movies: [],
      error: (err as Error).message,
    });
  }
});

router.get("/customers", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    const all = await customerQueries.getAll();
    const customers = all.slice(offset, offset + limit);
    const totalPages = Math.ceil(all.length / limit);

    res.render("customers", {
      customers,
      page,
      totalPages,
      error: null,
      title: "Customers",
    });
  } catch (err) {
    res.render("customers", {
      title: "Customers",
      customers: [],
      error: (err as Error).message,
    });
  }
});

router.get("/tickets", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    const all = await ticketQueries.getAll();
    const tickets = all.slice(offset, offset + limit);
    const totalPages = Math.ceil(all.length / limit);

    res.render("tickets", {
      tickets,
      page,
      totalPages,
      error: null,
      title: "Tickets",
    });
  } catch (err) {
    res.render("tickets", {
      title: "Tickets",
      tickets: [],
      error: (err as Error).message,
    });
  }
});

export default router;
