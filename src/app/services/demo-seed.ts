import { EscapeRoom } from '../models/escape-room.model';

const now = new Date('2026-03-18T19:00:00');

export const DEMO_ESCAPE_ROOMS: EscapeRoom[] = [
  {
    id: 'el-enigma-de-lavanda',
    name: 'El Enigma de Lavanda',
    company: 'Puzzle Atelier',
    city: 'Madrid',
    status: 'done',
    playedAt: new Date('2025-11-09'),
    players: 4,
    difficulty: 'Alta',
    theme: 'Investigación',
    fearLevel: 'Bajo',
    durationMinutes: 90,
    price: 92,
    recommended: true,
    notes: 'Narrativa muy bien hilada y final redondo. Ideal para grupos que disfrutan resolviendo con calma.',
    isFavorite: true,
    ratings: {
      history: 9.5,
      ambience: 9.2,
      gameplay: 9.4,
      gameMaster: 9.8,
      overall: 9.5,
      immersion: 9.3,
      puzzles: 9.1
    },
    meta: {
      createdAt: now,
      updatedAt: now
    }
  },
  {
    id: 'la-sala-13',
    name: 'La Sala 13',
    company: 'Clave Oculta',
    city: 'Barcelona',
    status: 'done',
    playedAt: new Date('2025-05-16'),
    players: 5,
    difficulty: 'Media-Alta',
    theme: 'Thriller',
    fearLevel: 'Medio',
    durationMinutes: 75,
    price: 105,
    recommended: true,
    notes: 'Ritmo muy constante. El tramo medio fue especialmente memorable.',
    isFavorite: true,
    ratings: {
      history: 8.9,
      ambience: 9.1,
      gameplay: 8.8,
      gameMaster: 9.4,
      overall: 9.1,
      immersion: 8.9,
      puzzles: 8.7
    },
    meta: {
      createdAt: now,
      updatedAt: now
    }
  },
  {
    id: 'expediente-cero',
    name: 'Expediente Cero',
    company: 'Distrito Secreto',
    city: 'Valencia',
    status: 'done',
    playedAt: new Date('2024-12-20'),
    players: 2,
    difficulty: 'Media',
    theme: 'Sci-Fi',
    fearLevel: 'Bajo',
    durationMinutes: 70,
    price: 68,
    recommended: false,
    notes: 'Muy técnica. Menos emocional, pero con buenos giros.',
    isFavorite: false,
    ratings: {
      history: 7.8,
      ambience: 8.4,
      gameplay: 8.1,
      gameMaster: 8.3,
      overall: 8.2,
      immersion: 8.5,
      puzzles: 8.6
    },
    meta: {
      createdAt: now,
      updatedAt: now
    }
  },
  {
    id: 'la-herencia-del-orfebre',
    name: 'La Herencia del Orfebre',
    company: 'Arcano Rooms',
    city: 'Sevilla',
    status: 'wishlist',
    playedAt: null,
    players: null,
    difficulty: 'Alta',
    theme: 'Aventura',
    fearLevel: 'Bajo',
    durationMinutes: null,
    price: null,
    recommended: null,
    notes: 'Pendiente por temática y ambientación artesanal.',
    isFavorite: true,
    ratings: {
      history: null,
      ambience: null,
      gameplay: null,
      gameMaster: null,
      overall: null,
      immersion: null,
      puzzles: null
    },
    meta: {
      createdAt: now,
      updatedAt: now
    }
  },
  {
    id: 'protocolo-niebla',
    name: 'Protocolo Niebla',
    company: 'Mente Cautiva',
    city: 'Bilbao',
    status: 'wishlist',
    playedAt: null,
    players: null,
    difficulty: 'Media-Alta',
    theme: 'Espionaje',
    fearLevel: 'Medio',
    durationMinutes: null,
    price: null,
    recommended: null,
    notes: 'Recomendación recurrente de amigos. Tiene muy buena fama por acting.',
    isFavorite: false,
    ratings: {
      history: null,
      ambience: null,
      gameplay: null,
      gameMaster: null,
      overall: null,
      immersion: null,
      puzzles: null
    },
    meta: {
      createdAt: now,
      updatedAt: now
    }
  }
];
