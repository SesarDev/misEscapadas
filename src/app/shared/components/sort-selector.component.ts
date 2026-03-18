import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoomSort } from '../../models/escape-room.model';
import { MATERIAL_IMPORTS } from '../material/material-imports';

@Component({
  selector: 'app-sort-selector',
  standalone: true,
  imports: [FormsModule, ...MATERIAL_IMPORTS],
  template: `
    <div class="sort-grid">
      <mat-form-field appearance="outline">
        <mat-label>Ordenar por</mat-label>
        <mat-select [ngModel]="sort.key" (ngModelChange)="updateKey($event)">
          <mat-option value="overall">Nota</mat-option>
          <mat-option value="playedAt">Fecha</mat-option>
          <mat-option value="city">Ciudad</mat-option>
          <mat-option value="company">Empresa</mat-option>
          <mat-option value="name">Alfabético</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Dirección</mat-label>
        <mat-select [ngModel]="sort.direction" (ngModelChange)="updateDirection($event)">
          <mat-option value="desc">Descendente</mat-option>
          <mat-option value="asc">Ascendente</mat-option>
        </mat-select>
      </mat-form-field>
    </div>
  `,
  styles: [
    `
      .sort-grid {
        display: grid;
        gap: 0.75rem;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SortSelectorComponent {
  @Input({ required: true }) sort!: RoomSort;
  @Output() sortChange = new EventEmitter<RoomSort>();

  updateKey(key: RoomSort['key']): void {
    this.sortChange.emit({ ...this.sort, key });
  }

  updateDirection(direction: RoomSort['direction']): void {
    this.sortChange.emit({ ...this.sort, direction });
  }
}
