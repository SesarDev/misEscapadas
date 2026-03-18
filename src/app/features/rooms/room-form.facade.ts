import { Injectable, inject } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { EscapeRoom } from '../../models/escape-room.model';
import { RoomFormValue } from '../../models/room-form.model';
import { calculateOverallRating } from '../../services/room-helpers';

@Injectable({ providedIn: 'root' })
export class RoomFormFacade {
  private readonly fb = inject(NonNullableFormBuilder);

  createForm(room?: EscapeRoom) {
    return this.fb.group({
      name: [room?.name ?? '', [Validators.required, Validators.maxLength(120)]],
      company: [room?.company ?? '', [Validators.required, Validators.maxLength(120)]],
      city: [room?.city ?? '', [Validators.required, Validators.maxLength(80)]],
      status: [room?.status ?? 'done'],
      playedAt: [room?.playedAt ? room.playedAt.toISOString().slice(0, 10) : null as string | null],
      players: [room?.players ?? null as number | null],
      difficulty: [room?.difficulty ?? '', [Validators.required, Validators.maxLength(40)]],
      theme: [room?.theme ?? '', [Validators.required, Validators.maxLength(60)]],
      fearLevel: [room?.fearLevel ?? '', [Validators.required, Validators.maxLength(40)]],
      durationMinutes: [room?.durationMinutes ?? null as number | null],
      price: [room?.price ?? null as number | null],
      recommended: [room?.recommended ?? null as boolean | null],
      notes: [room?.notes ?? '', [Validators.maxLength(4000)]],
      isFavorite: [room?.isFavorite ?? false],
      history: [room?.ratings.history ?? null as number | null],
      ambience: [room?.ratings.ambience ?? null as number | null],
      gameplay: [room?.ratings.gameplay ?? null as number | null],
      gameMaster: [room?.ratings.gameMaster ?? null as number | null],
      immersion: [room?.ratings.immersion ?? null as number | null],
      puzzles: [room?.ratings.puzzles ?? null as number | null]
    });
  }

  toBusinessValue(value: RoomFormValue): RoomFormValue {
    if (value.status === 'done') {
      return value;
    }

    return {
      ...value,
      playedAt: null,
      players: null,
      durationMinutes: null,
      price: null,
      recommended: null,
      history: null,
      ambience: null,
      gameplay: null,
      gameMaster: null,
      immersion: null,
      puzzles: null
    };
  }

  getOverall(value: RoomFormValue): number | null {
    return calculateOverallRating(value);
  }
}
