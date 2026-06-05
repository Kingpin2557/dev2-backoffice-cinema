import { Request, Response } from "express";
import { movieQueries } from "../../services/moviesService";

const LIMIT = 5;

export const getMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const offset = (page - 1) * LIMIT;
    const [movies, total] = await Promise.all([
      movieQueries.getPaginated(LIMIT, offset),
      movieQueries.getCount(),
    ]);
    const totalPages = Math.max(1, Math.ceil(total / LIMIT));
    res.render("movies", { title: "Movies", movies, page, totalPages, error: null });
  } catch (err) {
    res.render("movies", { title: "Movies", movies: [], page: 1, totalPages: 1, error: "Could not load movies. Please try again later." });
  }
};

export const getEditMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const movieId = parseInt(req.params.id as string);
    if (isNaN(movieId)) { res.status(400).send("Invalid record identifier."); return; }
    const record = await movieQueries.get(movieId);
    if (!record) { res.status(404).send("The requested record could not be found."); return; }
    res.render("partials/_dynamic-form", { title: "Edit movie", record, actionPath: `/movies/${movieId}/edit` });
  } catch {
    res.status(500).send("Internal Server Error processing layout compilation.");
  }
};

export const postEditMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const movieId = parseInt(req.params.id as string, 10);
    if (isNaN(movieId)) { res.status(400).send("Invalid record identifier."); return; }
    const updated = await movieQueries.update({
      ...req.body,
      id: movieId,
      durationMinutes: req.body.durationMinutes ? parseInt(req.body.durationMinutes as string, 10) : undefined,
    });
    if (!updated) { res.status(404).send(`Failed to update movie with id: ${movieId}`); return; }
    req.app.get("io")?.emit("movie:updated", updated);
    res.redirect("/movies");
  } catch {
    res.status(500).send("Internal Server Error saving changes.");
  }
};

export const getAddMovie = async (_req: Request, res: Response): Promise<void> => {
  res.render("partials/_dynamic-form", {
    title: "Add movie",
    record: { title: "", posterUrl: "", trailerUrl: "", description: "", durationMinutes: 0 },
    actionPath: "/movies/add",
  });
};

export const postAddMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const created = await movieQueries.create({
      ...req.body,
      durationMinutes: req.body.durationMinutes ? parseInt(req.body.durationMinutes as string, 10) : 0,
    });
    req.app.get("io")?.emit("movie:created", created);
    res.redirect("/movies");
  } catch {
    res.status(500).send("Internal Server Error saving changes.");
  }
};

export const deleteMovie = async (req: Request, res: Response): Promise<void> => {
  const movieId = parseInt(req.params.id as string, 10);
  await movieQueries.delete(movieId);
  req.app.get("io")?.emit("movie:deleted", movieId);
  res.redirect("/movies");
};
