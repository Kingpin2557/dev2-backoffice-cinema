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

    res.render("movies", {
      title: "Movies",
      movies,
      page,
      totalPages,
      error: null,
    });
  } catch (err) {
    res.render("movies", {
      title: "Movies",
      movies: [],
      page: 1,
      totalPages: 1,
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

    res.render("customers", {
      title: "Customers",
      customers,
      page,
      totalPages,
      error: null,
    });
  } catch (err) {
    res.render("customers", {
      title: "Customers",
      customers: [],
      page: 1,
      totalPages: 1,
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

    res.render("tickets", {
      title: "Tickets",
      tickets,
      page,
      totalPages,
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

router.post("/movies/:id/delete", async (req: Request, res: Response) => {
  const movieId = parseInt(req.params.id as string, 10);
  await movieQueries.delete(movieId);

  const io = req.app.get("io");
  io.emit("movie:deleted", movieId);

  res.redirect("/movies");
});

router.get(
  "/movies/:id/edit",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const movieId: number = parseInt(req.params.id as string);

      if (isNaN(movieId)) {
        res.status(400).send("Invalid record identifier.");
        return;
      }

      const movieData = await movieQueries.get(movieId);

      if (!movieData) {
        res.status(404).send("The requested record could not be found.");
        return;
      }

      res.render("partials/_dynamic-form", {
        title: "Edit movie",
        record: movieData,
        actionPath: `/movies/${movieId}/edit`,
      });
    } catch (error) {
      console.error("Database resolution error during edit fetch:", error);
      res
        .status(500)
        .send("Internal Server Error processing layout compilation.");
    }
  },
);

router.post(
  "/movies/:id/edit",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const movieId: number = parseInt(req.params.id as string, 10);

      if (isNaN(movieId)) {
        res.status(400).send("Invalid record identifier.");
        return;
      }

      const updatedMovie = await movieQueries.update({
        ...req.body,
        id: movieId,
        durationMinutes: req.body.durationMinutes
          ? parseInt(req.body.durationMinutes as string, 10)
          : undefined,
      });

      if (!updatedMovie) {
        res.status(404).send(`Failed to update movie with id: ${movieId} `);
      }

      const io = req.app.get("io");
      io.emit("movie:updated", updatedMovie);
      res.redirect("/movies");
    } catch (error) {
      console.error("Failed to update movie record:", error);
      res.status(500).send("Internal Server Error saving changes.");
    }
  },
);

router.get(
  "/customers/:id/edit",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const customerId = parseInt(req.params.id as string);
      if (isNaN(customerId)) {
        res.status(400).send("Invalid record identifier.");
        return;
      }
      const record = await customerQueries.get(customerId);
      if (!record) {
        res.status(404).send("The requested record could not be found.");
        return;
      }
      res.render("partials/_dynamic-form", {
        title: "Edit customer",
        record,
        actionPath: `/customers/${customerId}/edit`,
      });
    } catch (error) {
      res
        .status(500)
        .send("Internal Server Error processing layout compilation.");
    }
  },
);

router.post(
  "/customers/:id/edit",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const customerId = parseInt(req.params.id as string, 10);
      if (isNaN(customerId)) {
        res.status(400).send("Invalid record identifier.");
        return;
      }
      const updated = await customerQueries.update({
        ...req.body,
        id: customerId,
      });
      if (!updated) {
        res
          .status(404)
          .send(`Failed to update customer with id: ${customerId}`);
        return;
      }
      const io = req.app.get("io");
      io.emit("customer:updated", updated);
      res.redirect("/customers");
    } catch (error) {
      res.status(500).send("Internal Server Error saving changes.");
    }
  },
);

router.post("/customers/:id/delete", async (req: Request, res: Response) => {
  const customerId = parseInt(req.params.id as string, 10);
  await customerQueries.delete(customerId);

  if (!customerId) {
    res.status(404).send(`Failed to delete customer with id: ${customerId}`);
  }
  const io = req.app.get("io");
  io.emit("customer:deleted", customerId);

  res.redirect("/customers");
});

router.get(
  "/tickets/:id/edit",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const ticketId = parseInt(req.params.id as string);
      if (isNaN(ticketId)) {
        res.status(400).send("Invalid record identifier.");
        return;
      }
      const record = await ticketQueries.get(ticketId);
      if (!record) {
        res.status(404).send("The requested record could not be found.");
        return;
      }
      res.render("partials/_dynamic-form", {
        title: "Edit ticket",
        record,
        actionPath: `/tickets/${ticketId}/edit`,
      });
    } catch (error) {
      res
        .status(500)
        .send("Internal Server Error processing layout compilation.");
    }
  },
);

router.post(
  "/tickets/:id/edit",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const ticketId = parseInt(req.params.id as string, 10);
      if (isNaN(ticketId)) {
        res.status(400).send("Invalid record identifier.");
        return;
      }
      const updated = await ticketQueries.update({ ...req.body, id: ticketId });
      if (!updated) {
        res.status(404).send(`Failed to update ticket with id: ${ticketId}`);
        return;
      }
      const io = req.app.get("io");
      io.emit("ticket:updated", updated);
      res.redirect("/tickets");
    } catch (error) {
      res.status(500).send("Internal Server Error saving changes.");
    }
  },
);

router.post("/tickets/:id/delete", async (req: Request, res: Response) => {
  const ticketId = parseInt(req.params.id as string, 10);
  await ticketQueries.delete(ticketId);

  if (!ticketId) {
    res.status(404).send(`Failed to delete ticket with id: ${ticketId}`);
  }
  const io = req.app.get("io");
  io.emit("ticket:deleted", ticketId);

  res.redirect("/tickets");
});

export default router;
