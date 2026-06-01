import express from "express";
import { getMovies, getMovieById, createMovie } from "./controllers/movies";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
} from "./controllers/customers";
import { getTickets, getTicketById, createTicket } from "./controllers/tickets";

import { idValidation } from "./middleware/idValidation";

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
