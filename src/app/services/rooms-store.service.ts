import { Injectable, computed, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { EscapeRoom, RankingOptions, RoomStatsSummary } from '../models/escape-room.model';
import { RoomFormValue } from '../models/room-form.model';
import { DEFAULT_FILTERS, DEFAULT_SORT, createRoomFromForm, sortRooms, updateRoomFromForm } from './room-helpers';
import { RoomsRepositoryService } from './rooms-repository.service';

@Injectable({ providedIn: 'root' })
export class RoomsStoreService {
  private readonly repository = inject(RoomsRepositoryService);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly rooms = signal<EscapeRoom[]>([]);
  readonly filters = signal({ ...DEFAULT_FILTERS });
  readonly search = signal('');
  readonly sort = signal({ ...DEFAULT_SORT });
  readonly rankingOptions = signal<RankingOptions>({ limit: 10, includeWishlist: false });

  readonly filteredRooms = computed(() =>
    sortRooms(
      this.rooms().filter((room) => {
        const filters = this.filters();
        const search = this.search();
        const playedAfterDate = filters.playedAfter ? new Date(filters.playedAfter) : null;
        const normalizedSearch = search
          .normalize('NFD')
          .replace(/\p{Diacritic}/gu, '')
          .toLowerCase()
          .trim();
        const haystack = `${room.name} ${room.company}`.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

        return (
          (!normalizedSearch || haystack.includes(normalizedSearch)) &&
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
      }),
      this.sort()
    )
  );
  readonly favoriteRooms = computed(() => this.rooms().filter((room) => room.isFavorite));
  readonly completedRooms = computed(() => this.rooms().filter((room) => room.status === 'done'));
  readonly wishlistRooms = computed(() => this.rooms().filter((room) => room.status === 'wishlist'));
  readonly topRatedRooms = computed(() => sortRooms(this.completedRooms(), { key: 'overall', direction: 'desc' }).slice(0, 5));
  readonly rankingRooms = computed(() => {
    const base = this.rankingOptions().includeWishlist ? this.rooms() : this.completedRooms();
    return sortRooms(base, { key: 'overall', direction: 'desc' }).slice(0, this.rankingOptions().limit);
  });
  readonly summary = computed<RoomStatsSummary>(() => {
    const done = this.completedRooms();
    const ratings = done.map((room) => room.ratings.overall).filter((value): value is number => value !== null);
    const recommended = done.filter((room) => room.recommended).length;

    return {
      totalDone: done.length,
      totalWishlist: this.wishlistRooms().length,
      averageRating: ratings.length ? Number((ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1)) : 0,
      favorites: this.favoriteRooms().length,
      recommendedPercentage: done.length ? Math.round((recommended / done.length) * 100) : 0
    };
  });

  readonly filterOptions = computed(() => ({
    cities: this.uniqueValues((room) => room.city),
    companies: this.uniqueValues((room) => room.company),
    themes: this.uniqueValues((room) => room.theme),
    difficulties: this.uniqueValues((room) => room.difficulty),
    fearLevels: this.uniqueValues((room) => room.fearLevel),
    players: [...new Set(this.completedRooms().map((room) => room.players).filter((value): value is number => value !== null))].sort((a, b) => a - b)
  }));

  async initialize(): Promise<void> {
    await this.repository.seedDemoData(false);
    const rooms = await firstValueFrom(this.repository.watchRooms());
    this.rooms.set(sortRooms(rooms, this.sort()));
    this.loading.set(false);
  }

  async createRoom(value: RoomFormValue): Promise<void> {
    this.saving.set(true);
    try {
      const room = createRoomFromForm(value, this.slugify(value.name), new Date());
      await this.repository.saveRoom(room);
      this.upsert(room);
      this.openSnack('Sala añadida al cuaderno.');
    } finally {
      this.saving.set(false);
    }
  }

  async updateRoom(id: string, value: RoomFormValue): Promise<void> {
    const existing = this.findById(id);
    if (!existing) {
      return;
    }

    this.saving.set(true);
    try {
      const next = updateRoomFromForm(existing, value);
      await this.repository.saveRoom(next);
      this.upsert(next);
      this.openSnack('Cambios guardados.');
    } finally {
      this.saving.set(false);
    }
  }

  async deleteRoom(id: string): Promise<void> {
    await this.repository.deleteRoom(id);
    this.rooms.set(this.rooms().filter((room) => room.id !== id));
    this.openSnack('Sala eliminada.');
  }

  async toggleFavorite(id: string): Promise<void> {
    const room = this.findById(id);
    if (!room) {
      return;
    }

    const next = {
      ...room,
      isFavorite: !room.isFavorite,
      meta: {
        ...room.meta,
        updatedAt: new Date()
      }
    };

    await this.repository.saveRoom(next);
    this.upsert(next);
  }

  async seedDemoData(): Promise<void> {
    await this.repository.seedDemoData(true);
    const rooms = await firstValueFrom(this.repository.watchRooms());
    this.rooms.set(sortRooms(rooms, this.sort()));
    this.openSnack('Datos de ejemplo cargados.');
  }

  async clearAllData(): Promise<void> {
    await this.repository.clearDemoData();
    this.rooms.set([]);
    this.openSnack('Datos eliminados.');
  }

  setSearch(value: string): void {
    this.search.set(value);
  }

  setFilters(filters: typeof DEFAULT_FILTERS): void {
    this.filters.set(filters);
  }

  resetFilters(): void {
    this.filters.set({ ...DEFAULT_FILTERS });
    this.search.set('');
    this.sort.set({ ...DEFAULT_SORT });
  }

  setSort(sort: typeof DEFAULT_SORT): void {
    this.sort.set(sort);
  }

  setRankingOptions(options: RankingOptions): void {
    this.rankingOptions.set(options);
  }

  findById(id: string): EscapeRoom | undefined {
    return this.rooms().find((room) => room.id === id);
  }

  groupBy(property: keyof Pick<EscapeRoom, 'city' | 'company' | 'theme'>): Array<{ name: string; count: number }> {
    return Object.entries(
      this.completedRooms().reduce<Record<string, number>>((accumulator, room) => {
        accumulator[room[property]] = (accumulator[room[property]] ?? 0) + 1;
        return accumulator;
      }, {})
    )
      .map(([name, count]) => ({ name, count }))
      .sort((left, right) => right.count - left.count)
      .slice(0, 5);
  }

  private uniqueValues(selector: (room: EscapeRoom) => string): string[] {
    return [...new Set(this.rooms().map(selector).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
  }

  private upsert(room: EscapeRoom): void {
    this.rooms.set(sortRooms([...this.rooms().filter((entry) => entry.id !== room.id), room], this.sort()));
  }

  private slugify(value: string): string {
    const base = value
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    return `${base || 'sala'}-${Date.now().toString(36)}`;
  }

  private openSnack(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 2800 });
  }
}
