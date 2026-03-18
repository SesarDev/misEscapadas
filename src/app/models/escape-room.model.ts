export type EscapeRoomStatus = 'done' | 'wishlist';
export type SortKey = 'overall' | 'playedAt' | 'city' | 'company' | 'name';

export interface EscapeRoomRatings {
  history: number | null;
  ambience: number | null;
  gameplay: number | null;
  gameMaster: number | null;
  overall: number | null;
  immersion?: number | null;
  puzzles?: number | null;
}

export interface EscapeRoomMeta {
  createdAt: Date;
  updatedAt: Date;
}

export interface EscapeRoom {
  id: string;
  name: string;
  company: string;
  city: string;
  status: EscapeRoomStatus;
  playedAt: Date | null;
  players: number | null;
  difficulty: string;
  theme: string;
  fearLevel: string;
  durationMinutes: number | null;
  price: number | null;
  recommended: boolean | null;
  notes: string;
  isFavorite: boolean;
  ratings: EscapeRoomRatings;
  meta: EscapeRoomMeta;
}

export interface RoomFilters {
  city: string | null;
  company: string | null;
  theme: string | null;
  minRating: number | null;
  difficulty: string | null;
  fearLevel: string | null;
  playedAfter: string | null;
  players: number | null;
  recommendedOnly: boolean;
  status: EscapeRoomStatus | null;
  favoritesOnly: boolean;
}

export interface RoomSort {
  key: SortKey;
  direction: 'asc' | 'desc';
}

export interface RoomStatsSummary {
  totalDone: number;
  totalWishlist: number;
  averageRating: number;
  favorites: number;
  recommendedPercentage: number;
}

export interface RankingOptions {
  limit: number;
  includeWishlist: boolean;
}
