import express from "express";
import { getMovies, getMovieById, createMovie } from "./controllers/movies";

const router = express.Router();

router.get("/", getMovies);
router.get("/:id", getMovieById);
router.post("/movie", createMovie);

export default router;
