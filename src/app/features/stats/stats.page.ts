import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RoomsStoreService } from '../../services/rooms-store.service';
import { StatCardComponent } from '../../shared/components/stat-card.component';
import { MATERIAL_IMPORTS } from '../../shared/material/material-imports';

@Component({
  standalone: true,
  imports: [StatCardComponent, ...MATERIAL_IMPORTS],
  template: `
    <section class="page-header">
      <p class="eyebrow">Estadísticas</p>
      <h1>Radiografía de tus escapadas</h1>
      <p>Un vistazo a los patrones de juego, tus ciudades frecuentes y el pulso general de la colección.</p>
    </section>

    <section class="stats-grid">
      <app-stat-card label="Hechas" [value]="summary().totalDone" supporting="Experiencias completadas" />
      <app-stat-card label="Wishlist" [value]="summary().totalWishlist" supporting="Objetivos pendientes" />
      <app-stat-card label="Media" [value]="summary().averageRating" supporting="Valoración agregada" />
      <app-stat-card label="% recomendadas" [value]="summary().recommendedPercentage + '%'" supporting="Salas que repetirías" />
    </section>

    <section class="leaderboards">
      <mat-card>
        <mat-card-header><mat-card-title>Top ciudades</mat-card-title></mat-card-header>
        <mat-card-content>
          @for (item of store.groupBy('city'); track item.name) {
            <div class="row"><span>{{ item.name }}</span><strong>{{ item.count }}</strong></div>
          }
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header><mat-card-title>Top empresas</mat-card-title></mat-card-header>
        <mat-card-content>
          @for (item of store.groupBy('company'); track item.name) {
            <div class="row"><span>{{ item.name }}</span><strong>{{ item.count }}</strong></div>
          }
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header><mat-card-title>Top temáticas</mat-card-title></mat-card-header>
        <mat-card-content>
          @for (item of store.groupBy('theme'); track item.name) {
            <div class="row"><span>{{ item.name }}</span><strong>{{ item.count }}</strong></div>
          }
        </mat-card-content>
      </mat-card>
    </section>

    <mat-card>
      <mat-card-header><mat-card-title>Top valoradas</mat-card-title></mat-card-header>
      <mat-card-content>
        @for (room of store.topRatedRooms(); track room.id) {
          <div class="row"><span>{{ room.name }}</span><strong>{{ room.ratings.overall }}</strong></div>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .page-header,
      .stats-grid,
      .leaderboards {
        display: grid;
        gap: 1rem;
      }

      .stats-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .leaderboards {
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      }

      .eyebrow {
        margin: 0 0 0.3rem;
        color: var(--color-accent);
        text-transform: uppercase;
        letter-spacing: 0.14em;
        font-size: 0.72rem;
      }

      .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 0.35rem 0;
      }

      .row span {
        color: var(--color-muted);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsPageComponent {
  readonly store = inject(RoomsStoreService);
  readonly summary = this.store.summary;
}
