import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RoomsStoreService } from '../../services/rooms-store.service';
import { StatCardComponent } from '../../shared/components/stat-card.component';
import { RoomListComponent } from '../../shared/components/room-list.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog.component';
import { LoadingStateComponent } from '../../shared/components/loading-state.component';
import { MATERIAL_IMPORTS } from '../../shared/material/material-imports';

@Component({
  standalone: true,
  imports: [RouterLink, StatCardComponent, RoomListComponent, LoadingStateComponent, ...MATERIAL_IMPORTS],
  template: `
    @if (roomsStore.loading()) {
      <app-loading-state message="Preparando tablero personal..." />
    } @else {
    <section class="hero">
      <div>
        <p class="eyebrow">Panel de control</p>
        <h1>Tu mapa personal de salas, pistas y recuerdos.</h1>
        <p class="subtitle">Consulta de un vistazo lo jugado, lo pendiente y lo que realmente merece volver a recomendar.</p>
      </div>
      <a mat-flat-button color="primary" routerLink="/salas/nueva">Añadir sala</a>
    </section>

    <section class="stats-grid">
      <app-stat-card label="Hechas" [value]="summary().totalDone" supporting="Sesiones registradas" />
      <app-stat-card label="Wishlist" [value]="summary().totalWishlist" supporting="Pendientes con potencial" />
      <app-stat-card label="Media" [value]="summary().averageRating" supporting="Promedio de valoraciones" />
      <app-stat-card label="Favoritas" [value]="summary().favorites" supporting="Tus imprescindibles" />
    </section>

    <section class="quick-links">
      <a mat-stroked-button routerLink="/salas">Abrir listado</a>
      <a mat-stroked-button routerLink="/ranking">Ver ranking</a>
      <a mat-stroked-button routerLink="/estadisticas">Analizar stats</a>
    </section>

    <section class="favorites">
      <div>
        <p class="eyebrow">Favoritas</p>
        <h2>Las salas que más te han marcado</h2>
      </div>

      @if (favorites().length) {
        <app-room-list [rooms]="favorites()" (favorite)="toggleFavorite($event)" (delete)="deleteRoom($event)" />
      } @else {
        <mat-card>
          <mat-card-content>Aún no has marcado favoritas. Cuando lo hagas, aparecerán aquí como acceso rápido.</mat-card-content>
        </mat-card>
      }
    </section>
    }
  `,
  styles: [
    `
      .hero,
      .quick-links,
      .stats-grid,
      .favorites {
        display: grid;
        gap: 1rem;
      }

      .hero {
        padding: 1.5rem;
        border-radius: 1.75rem;
        background:
          radial-gradient(circle at top left, rgba(214, 179, 111, 0.25), transparent 40%),
          linear-gradient(145deg, rgba(25, 34, 48, 0.95), rgba(10, 13, 22, 0.92));
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .eyebrow {
        margin: 0;
        color: var(--color-accent);
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: 0.72rem;
      }

      h1 {
        margin: 0.65rem 0 0.5rem;
        font-size: clamp(2.3rem, 9vw, 4.2rem);
        line-height: 0.95;
      }

      .subtitle {
        margin: 0;
        color: var(--color-muted);
        max-width: 36rem;
      }

      .stats-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .quick-links {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent {
  readonly roomsStore = inject(RoomsStoreService);
  private readonly dialog = inject(MatDialog);

  readonly summary = this.roomsStore.summary;
  readonly favorites = computed(() => this.roomsStore.favoriteRooms().slice(0, 3));

  toggleFavorite(id: string): Promise<void> {
    return this.roomsStore.toggleFavorite(id);
  }

  async deleteRoom(id: string): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar sala',
        description: 'Esta acción borrará la ficha del panel y del listado personal.',
        confirmText: 'Eliminar'
      }
    });

    const confirmed = await dialogRef.afterClosed().toPromise();
    if (confirmed) {
      await this.roomsStore.deleteRoom(id);
    }
  }
}
