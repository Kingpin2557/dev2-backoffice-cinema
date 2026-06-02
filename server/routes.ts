import express from "express";
import {
  getMovies,
  getMovieById,
  createMovie,
  deleteMovie,
  updateMovie,
} from "./controllers/ctrlMovies";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  deleteCustomer,
  updateCustomer,
} from "./controllers/ctrlCustomers";
import {
  getTickets,
  getTicketById,
  createTicket,
  deleteTicket,
  updateTicket,
} from "./controllers/ctrlTickets";

import { idValidation } from "./middleware/idValidation";

const router = express.Router();

router.get("/movie", getMovies);
router.get("/movie/:id", idValidation, getMovieById);
router.post("/movie", createMovie);
router.delete("/movie/:id", idValidation, deleteMovie);
router.patch("/movie/:id", idValidation, updateMovie);

router.get("/customer", getCustomers);
router.get("/customer/:id", idValidation, getCustomerById);
router.post("/customer", createCustomer);
router.delete("/customer/:id", idValidation, deleteCustomer);
router.patch("/customer/:id", idValidation, updateCustomer);

router.get("/ticket", getTickets);
router.get("/ticket/:id", idValidation, getTicketById);
router.post("/ticket", createTicket);
router.delete("/ticket/:id", idValidation, deleteTicket);
router.patch("/ticket/:id", idValidation, updateTicket);

export default router;
