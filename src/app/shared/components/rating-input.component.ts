import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../material/material-imports';

@Component({
  selector: 'app-rating-input',
  standalone: true,
  imports: [ReactiveFormsModule, ...MATERIAL_IMPORTS],
  template: `
    <mat-form-field appearance="outline">
      <mat-label>{{ label }}</mat-label>
      <input matInput type="number" min="1" max="10" step="0.1" [formControl]="control">
      <span matTextSuffix>/10</span>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatingInputComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) control!: any;
}
