export interface RoomProto {
  cinemaId: number;
  projectionFormatId: number;
  soundSystemId: number;
  name: string;
}

export interface Room extends RoomProto {
  id: number;
}

export interface SeatAvailability {
  seatId: number;
  isReserved: boolean;
}
