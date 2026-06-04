import express from "express";
import {
  getMovies,
  getAddMovie,
  postAddMovie,
  getEditMovie,
  postEditMovie,
  deleteMovie,
} from "../controllers/pages/ctrlMoviesPages";
import {
  getCustomers,
  getAddCustomer,
  postAddCustomer,
  getEditCustomer,
  postEditCustomer,
  deleteCustomer,
} from "../controllers/pages/ctrlCustomersPages";
import {
  getTickets,
  getAddTicket,
  postAddTicket,
  getEditTicket,
  postEditTicket,
  deleteTicket,
} from "../controllers/pages/ctrlTicketsPages";

const router = express.Router();

router.get("/", (_req, res) => res.redirect("/movies"));

router.get("/movies", getMovies);
router.get("/movies/add", getAddMovie);
router.post("/movies/add", postAddMovie);
router.get("/movies/:id/edit", getEditMovie);
router.post("/movies/:id/edit", postEditMovie);
router.post("/movies/:id/delete", deleteMovie);

router.get("/customers", getCustomers);
router.get("/customers/add", getAddCustomer);
router.post("/customers/add", postAddCustomer);
router.get("/customers/:id/edit", getEditCustomer);
router.post("/customers/:id/edit", postEditCustomer);
router.post("/customers/:id/delete", deleteCustomer);

router.get("/tickets", getTickets);
router.get("/tickets/add", getAddTicket);
router.post("/tickets/add", postAddTicket);
router.get("/tickets/:id/edit", getEditTicket);
router.post("/tickets/:id/edit", postEditTicket);
router.post("/tickets/:id/delete", deleteTicket);

export default router;
