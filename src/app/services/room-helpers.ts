import { EscapeRoom, EscapeRoomRatings, RoomFilters, RoomSort } from '../models/escape-room.model';
import { RoomFormValue } from '../models/room-form.model';

export const DEFAULT_FILTERS: RoomFilters = {
  city: null,
  company: null,
  theme: null,
  minRating: null,
  difficulty: null,
  fearLevel: null,
  playedAfter: null,
  players: null,
  recommendedOnly: false,
  status: null,
  favoritesOnly: false
};

export const DEFAULT_SORT: RoomSort = {
  key: 'overall',
  direction: 'desc'
};

export function calculateOverallRating(ratings: Pick<EscapeRoomRatings, 'history' | 'ambience' | 'gameplay' | 'gameMaster'>): number | null {
  const baseRatings = [ratings.history, ratings.ambience, ratings.gameplay, ratings.gameMaster].filter(
    (value): value is number => value !== null
  );

  if (!baseRatings.length) {
    return null;
  }

  const total = baseRatings.reduce((sum, value) => sum + value, 0);
  return Math.round((total / baseRatings.length) * 10) / 10;
}

export function createRoomFromForm(value: RoomFormValue, id: string, createdAt: Date): EscapeRoom {
  const playedAt = value.playedAt ? new Date(value.playedAt) : null;

  return {
    id,
    name: value.name.trim(),
    company: value.company.trim(),
    city: value.city.trim(),
    status: value.status,
    playedAt,
    players: value.status === 'done' ? value.players : null,
    difficulty: value.difficulty.trim(),
    theme: value.theme.trim(),
    fearLevel: value.fearLevel.trim(),
    durationMinutes: value.status === 'done' ? value.durationMinutes : null,
    price: value.status === 'done' ? value.price : null,
    recommended: value.status === 'done' ? value.recommended : null,
    notes: value.notes.trim(),
    isFavorite: value.isFavorite,
    ratings: {
      history: value.history,
      ambience: value.ambience,
      gameplay: value.gameplay,
      gameMaster: value.gameMaster,
      overall: calculateOverallRating(value),
      immersion: value.immersion,
      puzzles: value.puzzles
    },
    meta: {
      createdAt,
      updatedAt: new Date()
    }
  };
}

export function updateRoomFromForm(existing: EscapeRoom, value: RoomFormValue): EscapeRoom {
  return {
    ...createRoomFromForm(value, existing.id, existing.meta.createdAt),
    meta: {
      createdAt: existing.meta.createdAt,
      updatedAt: new Date()
    }
  };
}

export function normalizeForSearch(value: string): string {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
}

export function matchesFilters(room: EscapeRoom, filters: RoomFilters, search: string): boolean {
  const normalizedSearch = normalizeForSearch(search);
  const matchesSearch =
    !normalizedSearch || normalizeForSearch(`${room.name} ${room.company}`).includes(normalizedSearch);

  const playedAfterDate = filters.playedAfter ? new Date(filters.playedAfter) : null;

  return (
    matchesSearch &&
    (!filters.city || room.city === filters.city) &&
    (!filters.company || room.company === filters.company) &&
    (!filters.theme || room.theme === filters.theme) &&
    (!filters.minRating || (room.ratings.overall ?? 0) >= filters.minRating) &&
    (!filters.difficulty || room.difficulty === filters.difficulty) &&
    (!filters.fearLevel || room.fearLevel === filters.fearLevel) &&
    (!playedAfterDate || (!!room.playedAt && room.playedAt >= playedAfterDate)) &&
    (!filters.players || room.players === filters.players) &&
    (!filters.recommendedOnly || room.recommended === true) &&
    (!filters.status || room.status === filters.status) &&
    (!filters.favoritesOnly || room.isFavorite)
  );
}

export function sortRooms(rooms: EscapeRoom[], sort: RoomSort): EscapeRoom[] {
  return [...rooms].sort((left, right) => {
    const direction = sort.direction === 'asc' ? 1 : -1;

    switch (sort.key) {
      case 'playedAt':
        return ((left.playedAt?.getTime() ?? 0) - (right.playedAt?.getTime() ?? 0)) * direction;
      case 'city':
        return left.city.localeCompare(right.city, 'es') * direction;
      case 'company':
        return left.company.localeCompare(right.company, 'es') * direction;
      case 'name':
        return left.name.localeCompare(right.name, 'es') * direction;
      case 'overall':
      default:
        return ((left.ratings.overall ?? 0) - (right.ratings.overall ?? 0)) * direction;
    }
  });
}

export function roomToStorage(room: EscapeRoom): Record<string, unknown> {
  return {
    ...room,
    playedAt: room.playedAt?.toISOString() ?? null,
    meta: {
      createdAt: room.meta.createdAt.toISOString(),
      updatedAt: room.meta.updatedAt.toISOString()
    }
  };
}

export function roomFromStorage(payload: Record<string, unknown>): EscapeRoom {
  const meta = payload['meta'] as { createdAt: string; updatedAt: string };
  return {
    ...(payload as unknown as EscapeRoom),
    playedAt: payload['playedAt'] ? new Date(payload['playedAt'] as string) : null,
    meta: {
      createdAt: new Date(meta.createdAt),
      updatedAt: new Date(meta.updatedAt)
    }
  };
}
