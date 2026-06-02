import type { Model } from "./shared";

export interface MovieProto extends Record<string, unknown> {
  title: string;
  posterUrl: string;
  trailerUrl: string;
  description: string;
  durationMinutes: number;
}

export interface Movie extends MovieProto {
  id: number;
}

export interface MovieModel extends Model<MovieProto, Movie, number> {
  getByDuration(duration: number): Promise<Movie[]>;
}
