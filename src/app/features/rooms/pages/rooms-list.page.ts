import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { RoomsStoreService } from '../../../services/rooms-store.service';
import { FilterPanelComponent } from '../../../shared/components/filter-panel.component';
import { SearchBarComponent } from '../../../shared/components/search-bar.component';
import { SortSelectorComponent } from '../../../shared/components/sort-selector.component';
import { RoomListComponent } from '../../../shared/components/room-list.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state.component';
import { MATERIAL_IMPORTS } from '../../../shared/material/material-imports';

@Component({
  standalone: true,
  imports: [RouterLink, FilterPanelComponent, SearchBarComponent, SortSelectorComponent, RoomListComponent, EmptyStateComponent, LoadingStateComponent, ...MATERIAL_IMPORTS],
  template: `
    @if (store.loading()) {
      <app-loading-state message="Abriendo listado..." />
    } @else {
    <section class="page-header">
      <div>
        <p class="eyebrow">Listado principal</p>
        <h1>Biblioteca de salas</h1>
      </div>
      <a mat-flat-button color="primary" routerLink="/salas/nueva">Nueva sala</a>
    </section>

    <section class="controls">
      <app-search-bar [value]="store.search()" (valueChange)="store.setSearch($event)" />
      <app-sort-selector [sort]="store.sort()" (sortChange)="store.setSort($event)" />
      <app-filter-panel [filters]="store.filters()" [options]="store.filterOptions()" (filtersChange)="store.setFilters($event)" (reset)="store.resetFilters()" />
    </section>

    <section class="results">
      <div class="results__meta">
        <strong>{{ store.filteredRooms().length }}</strong>
        <span>salas encontradas</span>
      </div>

      @if (store.filteredRooms().length) {
        <app-room-list [rooms]="store.filteredRooms()" (favorite)="store.toggleFavorite($event)" (delete)="confirmDelete($event)" />
      } @else {
        <app-empty-state title="No hay salas que encajen" description="Prueba otra combinación de búsqueda, filtros o vuelve a cargar el seed inicial." />
      }
    </section>
    }
  `,
  styles: [
    `
      .page-header,
      .controls,
      .results {
        display: grid;
        gap: 1rem;
      }

      .page-header {
        grid-template-columns: 1fr auto;
        align-items: end;
      }

      .eyebrow {
        margin: 0 0 0.3rem;
        color: var(--color-accent);
        text-transform: uppercase;
        letter-spacing: 0.14em;
        font-size: 0.72rem;
      }

      h1 {
        margin: 0;
      }

      .results__meta {
        display: flex;
        align-items: baseline;
        gap: 0.5rem;
        color: var(--color-muted);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomsListPageComponent {
  readonly store = inject(RoomsStoreService);
  private readonly dialog = inject(MatDialog);

  async confirmDelete(id: string): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar sala',
        description: 'Esta acción borrará la sala del listado personal. No se puede deshacer.',
        confirmText: 'Eliminar'
      }
    });

    const confirmed = await dialogRef.afterClosed().toPromise();
    if (confirmed) {
      await this.store.deleteRoom(id);
    }
  }
}
