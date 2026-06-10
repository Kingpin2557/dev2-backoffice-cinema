export interface ShowtimeProto {
  roomId: number;
  movieId: number;
  startTime: Date;
  endTime: Date;
}

export interface Showtime extends ShowtimeProto {
  id: number;
}

// Enriched shape returned by the kiosk endpoints
export interface PlayingMovie {
  id: number;
  title: string;
  posterUrl: string;
  trailerUrl: string;
  description: string;
  durationMinutes: number;
  genres: string[];
  language: string;
  languageDisplay: string;
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
  languageDisplay: string;
}
