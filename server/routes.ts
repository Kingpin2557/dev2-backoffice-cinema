import express from "express";
import { getMovies, getMovieById, createMovie } from "./controllers/movies";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
} from "./controllers/customers";

const router = express.Router();

router.get("/movies", getMovies);
router.get("/movie/:id", getMovieById);
router.post("/movie", createMovie);

router.get("/customers", getCustomers);
router.get("/customer/:id", getCustomerById);
router.post("/customer", createCustomer);

export default router;
