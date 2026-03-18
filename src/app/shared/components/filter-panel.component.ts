import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoomFilters } from '../../models/escape-room.model';
import { MATERIAL_IMPORTS } from '../material/material-imports';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [FormsModule, ...MATERIAL_IMPORTS],
  template: `
    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <mat-panel-title>Filtros combinables</mat-panel-title>
        <mat-panel-description>Afina la búsqueda personal</mat-panel-description>
      </mat-expansion-panel-header>

      <div class="grid">
        <mat-form-field appearance="outline">
          <mat-label>Ciudad</mat-label>
          <mat-select [ngModel]="filters.city" (ngModelChange)="patch('city', $event)">
            <mat-option [value]="null">Todas</mat-option>
            @for (city of options.cities; track city) {
              <mat-option [value]="city">{{ city }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Empresa</mat-label>
          <mat-select [ngModel]="filters.company" (ngModelChange)="patch('company', $event)">
            <mat-option [value]="null">Todas</mat-option>
            @for (company of options.companies; track company) {
              <mat-option [value]="company">{{ company }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Temática</mat-label>
          <mat-select [ngModel]="filters.theme" (ngModelChange)="patch('theme', $event)">
            <mat-option [value]="null">Todas</mat-option>
            @for (theme of options.themes; track theme) {
              <mat-option [value]="theme">{{ theme }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Dificultad</mat-label>
          <mat-select [ngModel]="filters.difficulty" (ngModelChange)="patch('difficulty', $event)">
            <mat-option [value]="null">Todas</mat-option>
            @for (difficulty of options.difficulties; track difficulty) {
              <mat-option [value]="difficulty">{{ difficulty }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Miedo</mat-label>
          <mat-select [ngModel]="filters.fearLevel" (ngModelChange)="patch('fearLevel', $event)">
            <mat-option [value]="null">Todos</mat-option>
            @for (fearLevel of options.fearLevels; track fearLevel) {
              <mat-option [value]="fearLevel">{{ fearLevel }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Nota mínima</mat-label>
          <input matInput type="number" min="0" max="10" step="0.1" [ngModel]="filters.minRating" (ngModelChange)="patch('minRating', numberOrNull($event))">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Jugadores</mat-label>
          <mat-select [ngModel]="filters.players" (ngModelChange)="patch('players', $event)">
            <mat-option [value]="null">Todos</mat-option>
            @for (players of options.players; track players) {
              <mat-option [value]="players">{{ players }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Fecha desde</mat-label>
          <input matInput type="date" [ngModel]="filters.playedAfter" (ngModelChange)="patch('playedAfter', $event)">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Estado</mat-label>
          <mat-select [ngModel]="filters.status" (ngModelChange)="patch('status', $event)">
            <mat-option [value]="null">Todos</mat-option>
            <mat-option value="done">Hechas</mat-option>
            <mat-option value="wishlist">Wishlist</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="toggles">
        <mat-slide-toggle [ngModel]="filters.recommendedOnly" (ngModelChange)="patch('recommendedOnly', $event)">Solo recomendadas</mat-slide-toggle>
        <mat-slide-toggle [ngModel]="filters.favoritesOnly" (ngModelChange)="patch('favoritesOnly', $event)">Solo favoritas</mat-slide-toggle>
      </div>

      <div class="actions">
        <button mat-stroked-button color="primary" type="button" (click)="reset.emit()">Limpiar filtros</button>
      </div>
    </mat-expansion-panel>
  `,
  styles: [
    `
      .grid {
        display: grid;
        gap: 0.75rem;
      }

      .toggles,
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-top: 0.5rem;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterPanelComponent {
  @Input({ required: true }) filters!: RoomFilters;
  @Input({ required: true }) options!: {
    cities: string[];
    companies: string[];
    themes: string[];
    difficulties: string[];
    fearLevels: string[];
    players: number[];
  };

  @Output() filtersChange = new EventEmitter<RoomFilters>();
  @Output() reset = new EventEmitter<void>();

  patch<K extends keyof RoomFilters>(key: K, value: RoomFilters[K]): void {
    this.filtersChange.emit({ ...this.filters, [key]: value });
  }

  numberOrNull(value: string | number | null): number | null {
    return value === null || value === '' ? null : Number(value);
  }
}
