import express, { Request, Response } from "express";
import { movieQueries } from "../services/moviesService";
import { customerQueries } from "../services/customerService";
import { ticketQueries } from "../services/ticketService";

const router = express.Router();

router.get("/", (_req, res) => res.redirect("/movies"));

router.get("/movies", async (_req: Request, res: Response) => {
  try {
    const movies = await movieQueries.getAll();
    res.render("movies", { title: "Movies", movies, error: null });
  } catch (err) {
    res.render("movies", {
      title: "Movies",
      movies: [],
      error: (err as Error).message,
    });
  }
});

router.get("/customers", async (_req: Request, res: Response) => {
  try {
    const customers = await customerQueries.getAll();
    res.render("customers", { title: "Customers", customers, error: null });
  } catch (err) {
    res.render("customers", {
      title: "Customers",
      customers: [],
      error: (err as Error).message,
    });
  }
});

router.get("/tickets", async (_req: Request, res: Response) => {
  try {
    const tickets = await ticketQueries.getAll();
    res.render("tickets", { title: "Tickets", tickets, error: null });
  } catch (err) {
    res.render("tickets", {
      title: "Tickets",
      tickets: [],
      error: (err as Error).message,
    });
  }
});

export default router;
