import express from "express";
import { getMovies, getMovieById, createMovie } from "./controllers/getMovies";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
} from "./controllers/getCustomers";
import {
  getTickets,
  getTicketById,
  createTicket,
} from "./controllers/getTickets";

import { idValidation } from "./middleware/idValidation";

export interface Model<
  proto extends Record<string, unknown>,
  model extends proto = proto,
  id extends number = number,
> {
  create(data: proto): Promise<model>;

  get(id: id): Promise<model | null>;
  getAll(): Promise<model[]>;

  update(data: Partial<proto>): Promise<model | null>;

  delete(id: id): Promise<boolean>;
}

const router = express.Router();

router.get("/movie", getMovies);
router.get("/movie/:id", idValidation, getMovieById);
router.post("/movie", createMovie);

router.get("/customer", getCustomers);
router.get("/customer/:id", idValidation, getCustomerById);
router.post("/customer", createCustomer);

router.get("/ticket", getTickets);
router.get("/ticket/:id", idValidation, getTicketById);
router.post("/ticket", createTicket);

export default router;
