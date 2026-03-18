import { calculateOverallRating, matchesFilters, sortRooms } from './room-helpers';
import { EscapeRoom } from '../models/escape-room.model';

describe('room-helpers', () => {
  const room: EscapeRoom = {
    id: 'test',
    name: 'La Camara',
    company: 'Arcano',
    city: 'Madrid',
    status: 'done',
    playedAt: new Date('2025-01-01'),
    players: 4,
    difficulty: 'Alta',
    theme: 'Investigacion',
    fearLevel: 'Medio',
    durationMinutes: 90,
    price: 80,
    recommended: true,
    notes: '',
    isFavorite: true,
    ratings: {
      history: 9,
      ambience: 8,
      gameplay: 9,
      gameMaster: 10,
      overall: 9,
      immersion: 9,
      puzzles: 8
    },
    meta: {
      createdAt: new Date(),
      updatedAt: new Date()
    }
  };

  it('calcula la media con un decimal', () => {
    expect(calculateOverallRating(room.ratings)).toBe(9);
  });

  it('filtra por busqueda y favoritos', () => {
    const match = matchesFilters(
      room,
      {
        city: null,
        company: null,
        theme: null,
        minRating: 8,
        difficulty: null,
        fearLevel: null,
        playedAfter: null,
        players: null,
        recommendedOnly: false,
        status: null,
        favoritesOnly: true
      },
      'camara'
    );

    expect(match).toBeTrue();
  });

  it('ordena por nota descendente', () => {
    const sorted = sortRooms([room, { ...room, id: '2', ratings: { ...room.ratings, overall: 7.5 } }], { key: 'overall', direction: 'desc' });
    expect(sorted[0].id).toBe('test');
  });
});
