import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoomsStoreService } from '../../services/rooms-store.service';
import { RoomListComponent } from '../../shared/components/room-list.component';
import { MATERIAL_IMPORTS } from '../../shared/material/material-imports';

@Component({
  standalone: true,
  imports: [FormsModule, RoomListComponent, ...MATERIAL_IMPORTS],
  template: `
    <section class="page-header">
      <p class="eyebrow">Ranking</p>
      <h1>Tus mejores salas</h1>
    </section>

    <section class="toolbar">
      <mat-form-field appearance="outline">
        <mat-label>Límite</mat-label>
        <mat-select [ngModel]="store.rankingOptions().limit" (ngModelChange)="updateLimit($event)">
          <mat-option [value]="5">Top 5</mat-option>
          <mat-option [value]="10">Top 10</mat-option>
          <mat-option [value]="20">Top 20</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-slide-toggle [ngModel]="store.rankingOptions().includeWishlist" (ngModelChange)="toggleWishlist($event)">
        Incluir wishlist
      </mat-slide-toggle>
    </section>

    <app-room-list [rooms]="store.rankingRooms()" (favorite)="store.toggleFavorite($event)" (delete)="store.deleteRoom($event)" />
  `,
  styles: [
    `
      .page-header,
      .toolbar {
        display: grid;
        gap: 1rem;
      }

      .toolbar {
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        align-items: center;
      }

      .eyebrow {
        margin: 0 0 0.3rem;
        color: var(--color-accent);
        text-transform: uppercase;
        letter-spacing: 0.14em;
        font-size: 0.72rem;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RankingPageComponent {
  readonly store = inject(RoomsStoreService);

  updateLimit(limit: number): void {
    this.store.setRankingOptions({ ...this.store.rankingOptions(), limit });
  }

  toggleWishlist(includeWishlist: boolean): void {
    this.store.setRankingOptions({ ...this.store.rankingOptions(), includeWishlist });
  }
}
