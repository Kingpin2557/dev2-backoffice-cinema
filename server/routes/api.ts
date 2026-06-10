import express from "express";
import {
  getMovies, getMovieById, createMovie, updateMovie, deleteMovie,
  getAllGenres, getGenresForMovie, getAllDates, getDatesForMovie,
  getLanguagesForMovie, getSubtitlesForMovie, getFormatsForMovie,
} from "../controllers/api/ctrlMoviesApi";
import {
  getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer,
} from "../controllers/api/ctrlCustomersApi";
import {
  getTickets, getTicketById, createTicket, updateTicket, deleteTicket,
} from "../controllers/api/ctrlTicketsApi";
import {
  getShowtimes, getShowtimeById, createShowtime, updateShowtime, deleteShowtime,
  getPlayingMovies, getUniqueDates, getShowtimesForMovie,
} from "../controllers/api/ctrlShowtimesApi";
import {
  getSeatsForShowtime, getLanguagesForRoom, getFormatsForRoom,
} from "../controllers/api/ctrlRoomsApi";
import { idValidation } from "../middleware/idValidation";

const router = express.Router();

// Movies - specific routes before /:id
router.get("/movie/genres", getAllGenres);
router.get("/movie/dates", getAllDates);
router.get("/movie", getMovies);
router.get("/movie/:id/genres", getGenresForMovie);
router.get("/movie/:id/dates", getDatesForMovie);
router.get("/movie/:id/languages", getLanguagesForMovie);
router.get("/movie/:id/subtitles", getSubtitlesForMovie);
router.get("/movie/:id/formats", getFormatsForMovie);
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

// Showtimes - specific routes before /:id
router.get("/showtime/playing", getPlayingMovies);
router.get("/showtime/dates", getUniqueDates);
router.get("/showtime/movie/:movieId", getShowtimesForMovie);
router.get("/showtime", getShowtimes);
router.get("/showtime/:id", idValidation, getShowtimeById);
router.post("/showtime", createShowtime);
router.patch("/showtime/:id", idValidation, updateShowtime);
router.delete("/showtime/:id", idValidation, deleteShowtime);

// Rooms
router.get("/room/:id/languages", getLanguagesForRoom);
router.get("/room/:id/formats", getFormatsForRoom);
router.get("/room/:roomId/seats/:showtimeId", getSeatsForShowtime);

export default router;
