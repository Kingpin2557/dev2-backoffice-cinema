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
import {
  getShowtimes,
  getShowtimeById,
  createShowtime,
  updateShowtime,
  deleteShowtime,
  getPlayingMovies,
  getUniqueDates,
  getShowtimesForMovie,
} from "../controllers/api/ctrlShowtimesApi";
import { getSeatsForShowtime } from "../controllers/api/ctrlRoomsApi";
import { idValidation } from "../middleware/idValidation";

const router = express.Router();

// Movies
router.get("/movie", getMovies);
router.get("/movie/:id", idValidation, getMovieById);
router.post("/movie", createMovie);
router.patch("/movie/:id", idValidation, updateMovie);
router.delete("/movie/:id", idValidation, deleteMovie);

// Customers
router.get("/customer", getCustomers);
router.get("/customer/:id", idValidation, getCustomerById);
router.post("/customer", createCustomer);
router.patch("/customer/:id", idValidation, updateCustomer);
router.delete("/customer/:id", idValidation, deleteCustomer);

// Tickets
router.get("/ticket", getTickets);
router.get("/ticket/:id", idValidation, getTicketById);
router.post("/ticket", createTicket);
router.patch("/ticket/:id", idValidation, updateTicket);
router.delete("/ticket/:id", idValidation, deleteTicket);

// Showtimes - specific routes must come before /:id to avoid conflicts
router.get("/showtime/playing", getPlayingMovies);
router.get("/showtime/dates", getUniqueDates);
router.get("/showtime/movie/:movieId", getShowtimesForMovie);
router.get("/showtime", getShowtimes);
router.get("/showtime/:id", idValidation, getShowtimeById);
router.post("/showtime", createShowtime);
router.patch("/showtime/:id", idValidation, updateShowtime);
router.delete("/showtime/:id", idValidation, deleteShowtime);

// Rooms
router.get("/room/:roomId/seats/:showtimeId", getSeatsForShowtime);

export default router;
