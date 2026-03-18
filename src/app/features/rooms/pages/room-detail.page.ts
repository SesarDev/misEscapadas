import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { RoomsStoreService } from '../../../services/rooms-store.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog.component';
import { MATERIAL_IMPORTS } from '../../../shared/material/material-imports';

@Component({
  standalone: true,
  imports: [DatePipe, RouterLink, ...MATERIAL_IMPORTS],
  template: `
    @if (room(); as roomValue) {
      <section class="detail-hero">
        <div>
          <p class="eyebrow">{{ roomValue.status === 'done' ? 'Sala completada' : 'En wishlist' }}</p>
          <h1>{{ roomValue.name }}</h1>
          <p>{{ roomValue.company }} · {{ roomValue.city }}</p>
        </div>

        <div class="detail-hero__score">
          <span>Nota global</span>
          <strong>{{ roomValue.ratings.overall ?? 'Pend.' }}</strong>
        </div>
      </section>

      <section class="detail-grid">
        <mat-card>
          <mat-card-header><mat-card-title>Ficha general</mat-card-title></mat-card-header>
          <mat-card-content class="list">
            <div><span>Temática</span><strong>{{ roomValue.theme }}</strong></div>
            <div><span>Dificultad</span><strong>{{ roomValue.difficulty }}</strong></div>
            <div><span>Miedo</span><strong>{{ roomValue.fearLevel }}</strong></div>
            <div><span>Jugadores</span><strong>{{ roomValue.players ?? 'Pendiente' }}</strong></div>
            <div><span>Duración</span><strong>{{ roomValue.durationMinutes ?? 'Pendiente' }}</strong></div>
            <div><span>Precio</span><strong>{{ roomValue.price ?? 'Pendiente' }}</strong></div>
            <div><span>Fecha</span><strong>{{ roomValue.playedAt ? (roomValue.playedAt | date: 'dd/MM/yyyy') : 'Pendiente' }}</strong></div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header><mat-card-title>Valoraciones</mat-card-title></mat-card-header>
          <mat-card-content class="list">
            <div><span>Historia</span><strong>{{ roomValue.ratings.history ?? '—' }}</strong></div>
            <div><span>Ambientación</span><strong>{{ roomValue.ratings.ambience ?? '—' }}</strong></div>
            <div><span>Gameplay</span><strong>{{ roomValue.ratings.gameplay ?? '—' }}</strong></div>
            <div><span>Game master</span><strong>{{ roomValue.ratings.gameMaster ?? '—' }}</strong></div>
            <div><span>Inmersión</span><strong>{{ roomValue.ratings.immersion ?? '—' }}</strong></div>
            <div><span>Puzles</span><strong>{{ roomValue.ratings.puzzles ?? '—' }}</strong></div>
          </mat-card-content>
        </mat-card>
      </section>

      <mat-card class="notes-card">
        <mat-card-header><mat-card-title>Notas personales</mat-card-title></mat-card-header>
        <mat-card-content>{{ roomValue.notes || 'Sin notas adicionales.' }}</mat-card-content>
      </mat-card>

      <section class="actions">
        <button mat-stroked-button type="button" (click)="toggleFavorite()">{{ roomValue.isFavorite ? 'Quitar favorita' : 'Marcar favorita' }}</button>
        <a mat-stroked-button [routerLink]="['/salas', roomValue.id, 'editar']">Editar</a>
        <button mat-flat-button color="warn" type="button" (click)="deleteRoom(roomValue.id)">Borrar</button>
      </section>
    }
  `,
  styles: [
    `
      .detail-hero,
      .detail-grid,
      .actions {
        display: grid;
        gap: 1rem;
      }

      .detail-hero {
        padding: 1.4rem;
        border-radius: 1.4rem;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: linear-gradient(140deg, rgba(214, 179, 111, 0.16), rgba(255, 255, 255, 0.03));
      }

      .detail-hero__score strong {
        display: block;
        font-family: var(--font-display);
        font-size: 2.6rem;
      }

      .list {
        display: grid;
        gap: 0.65rem;
      }

      .list div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }

      .list span {
        color: var(--color-muted);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(RoomsStoreService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  private readonly roomId = toSignal(this.route.paramMap.pipe(map((params) => params.get('id'))), { initialValue: null });
  readonly room = computed(() => (this.roomId() ? this.store.findById(this.roomId() as string) : undefined));

  toggleFavorite(): Promise<void> {
    const id = this.roomId();
    return id ? this.store.toggleFavorite(id) : Promise.resolve();
  }

  async deleteRoom(id: string): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar sala',
        description: 'Se borrará la ficha, valoraciones y notas personales.',
        confirmText: 'Eliminar'
      }
    });

    const confirmed = await dialogRef.afterClosed().toPromise();
    if (!confirmed) {
      return;
    }

    await this.store.deleteRoom(id);
    await this.router.navigateByUrl('/salas');
  }
}
