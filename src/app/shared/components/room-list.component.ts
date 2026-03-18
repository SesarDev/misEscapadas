import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EscapeRoom } from '../../models/escape-room.model';
import { MATERIAL_IMPORTS } from '../material/material-imports';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [DatePipe, RouterLink, ...MATERIAL_IMPORTS],
  template: `
    <div class="room-list">
      @for (room of rooms; track room.id) {
        <mat-card class="room-card" [class.room-card--wishlist]="room.status === 'wishlist'">
          <mat-card-content>
            <div class="room-card__top">
              <div>
                <div class="chips">
                  <mat-chip>{{ room.status === 'done' ? 'Hecha' : 'Wishlist' }}</mat-chip>
                  @if (room.isFavorite) {
                    <mat-chip class="accent-chip">Favorita</mat-chip>
                  }
                </div>
                <h3>{{ room.name }}</h3>
                <p>{{ room.company }} · {{ room.city }}</p>
              </div>

              <button mat-icon-button type="button" (click)="favorite.emit(room.id)" [attr.aria-label]="'Favorita ' + room.name">
                <mat-icon>{{ room.isFavorite ? 'favorite' : 'favorite_border' }}</mat-icon>
              </button>
            </div>

            <div class="room-card__meta">
              <span>Tema: {{ room.theme }}</span>
              <span>Dificultad: {{ room.difficulty }}</span>
              <span>Miedo: {{ room.fearLevel }}</span>
              @if (room.playedAt) {
                <span>Fecha: {{ room.playedAt | date: 'dd/MM/yyyy' }}</span>
              }
            </div>

            <div class="room-card__score">
              <strong>{{ room.ratings.overall ?? 'Pend.' }}</strong>
              <small>{{ room.status === 'done' ? 'nota global' : 'sin valorar' }}</small>
            </div>

            <div class="room-card__actions">
              <a mat-stroked-button [routerLink]="['/salas', room.id]">Ver</a>
              <a mat-stroked-button [routerLink]="['/salas', room.id, 'editar']">Editar</a>
              <button mat-button type="button" color="warn" (click)="delete.emit(room.id)">Borrar</button>
            </div>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [
    `
      .room-list {
        display: grid;
        gap: 1rem;
      }

      .room-card {
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.035);
      }

      .room-card--wishlist {
        background: linear-gradient(180deg, rgba(55, 78, 112, 0.18), rgba(255, 255, 255, 0.03));
      }

      .room-card__top,
      .room-card__actions,
      .chips,
      .room-card__meta {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .room-card__top {
        align-items: flex-start;
        justify-content: space-between;
      }

      h3 {
        margin: 0.35rem 0 0.25rem;
      }

      p {
        margin: 0;
        color: var(--color-muted);
      }

      .room-card__meta {
        margin-top: 0.85rem;
        color: var(--color-muted);
        font-size: 0.9rem;
      }

      .room-card__score {
        margin: 1rem 0;
      }

      .room-card__score strong {
        font-size: 2rem;
        font-family: var(--font-display);
      }

      .room-card__score small {
        display: block;
        color: var(--color-muted);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomListComponent {
  @Input({ required: true }) rooms!: EscapeRoom[];
  @Output() favorite = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
}
