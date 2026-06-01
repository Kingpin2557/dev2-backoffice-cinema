import express, { Request, Response } from "express";
import { getMovies, getMovieById } from "./services/moviesService";

const router = express.Router();

/**
 * GET / - Laadt de homepagina
 */
router.get("/", async (_req: Request, res: Response): Promise<void> => {
  const movies = await getMovies();

  if (!movies) {
    res.status(404).json({ error: "No movies found" });
  }
  res.json(movies);
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const movie = await getMovieById(id as string);

  if (!movie) {
    res.status(404).json({ error: "Movie not found" });
    return;
  }
  res.json(movie);
});

export default router;
