import { EscapeRoomStatus } from './escape-room.model';

export interface RoomFormValue {
  name: string;
  company: string;
  city: string;
  status: EscapeRoomStatus;
  playedAt: string | null;
  players: number | null;
  difficulty: string;
  theme: string;
  fearLevel: string;
  durationMinutes: number | null;
  price: number | null;
  recommended: boolean | null;
  notes: string;
  isFavorite: boolean;
  history: number | null;
  ambience: number | null;
  gameplay: number | null;
  gameMaster: number | null;
  immersion: number | null;
  puzzles: number | null;
}
