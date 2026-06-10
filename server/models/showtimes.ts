export interface ShowtimeProto {
  roomId: number;
  movieId: number;
  startTime: Date;
  endTime: Date;
}

export interface Showtime extends ShowtimeProto {
  id: number;
}

export interface PlayingMovie {
  id: number;
  title: string;
  posterUrl: string;
  trailerUrl: string;
  description: string;
  durationMinutes: number;
  imbd_score: number | null;
  age_limit: string | null;
  genres: string[];
  dates: string[];
  language: string;
  subtitles: string;
}

export interface ShowtimeSlot {
  id: number;
  startTime: Date;
  endTime: Date;
  roomId: number;
  roomName: string;
  formatName: string;
  language: string;
}
