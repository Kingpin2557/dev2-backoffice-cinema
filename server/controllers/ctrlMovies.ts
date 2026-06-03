import type { Request, Response } from "express";
import type { Movie } from "../models/movies";
import { io } from "../app";

import { movieQueries } from "../services/moviesService";

export const getMovies = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const arrMovies = await movieQueries.getAll();

    if (!arrMovies || arrMovies.length === 0) {
      res.status(404).json({ error: "Movies not found" });
      return;
    }

    res.status(200).json(arrMovies);
  } catch (err) {
    console.error("Failed to fetch movies:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMovieById = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const movie = await movieQueries.get(res.locals.numericId);

    if (!movie) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    res.status(200).json(movie);
  } catch (err) {
    console.error(
      `Failed to fetch movie with id: ${res.locals.numericId}`,
      err,
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createMovie = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const movie = req.body as Movie;

    if (!movie || Object.keys(movie).length === 0) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const created = await movieQueries.create(movie);

    io.emit("movie:create", created);
    res.status(201).json(created);
  } catch (err) {
    console.error("Failed to create movie:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMovie = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const deleted = await movieQueries.delete(res.locals.numericId);

    if (!deleted) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    io.emit("movie:delete", deleted);
    res.status(200).json(deleted);
  } catch (err) {
    console.error(
      `Failed to delete movie with id: ${res.locals.numericId}`,
      err,
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateMovie = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const updated = await movieQueries.update({
      ...(req.body as Partial<Movie>),
      id: res.locals.numericId,
    });

    if (!updated) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    io.emit("movie:updated", updated);
    res.status(200).json(updated);
  } catch (err) {
    console.error(
      `Failed to update movie with id: ${res.locals.numericId}`,
      err,
    );
    res.status(500).json({ error: "Internal server error" });
  }
};
