import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../material/material-imports';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, ...MATERIAL_IMPORTS],
  template: `
    <mat-form-field appearance="outline" class="full-width">
      <mat-label>{{ label }}</mat-label>
      <mat-icon matPrefix>search</mat-icon>
      <input matInput [ngModel]="value" (ngModelChange)="valueChange.emit($event)" [placeholder]="placeholder">
    </mat-form-field>
  `,
  styles: ['.full-width { width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBarComponent {
  @Input() label = 'Buscar';
  @Input() placeholder = 'Nombre o empresa';
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();
}
