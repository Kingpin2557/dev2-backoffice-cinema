import express from "express";
import {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/api/ctrlMoviesApi";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/api/ctrlCustomersApi";
import {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../controllers/api/ctrlTicketsApi";
import { idValidation } from "../middleware/idValidation";

const router = express.Router();

router.get("/movie", getMovies);
router.get("/movie/:id", idValidation, getMovieById);
router.post("/movie", createMovie);
router.patch("/movie/:id", idValidation, updateMovie);
router.delete("/movie/:id", idValidation, deleteMovie);

router.get("/customer", getCustomers);
router.get("/customer/:id", idValidation, getCustomerById);
router.post("/customer", createCustomer);
router.patch("/customer/:id", idValidation, updateCustomer);
router.delete("/customer/:id", idValidation, deleteCustomer);

router.get("/ticket", getTickets);
router.get("/ticket/:id", idValidation, getTicketById);
router.post("/ticket", createTicket);
router.patch("/ticket/:id", idValidation, updateTicket);
router.delete("/ticket/:id", idValidation, deleteTicket);

export default router;
