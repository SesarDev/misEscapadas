import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MATERIAL_IMPORTS } from '../material/material-imports';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [...MATERIAL_IMPORTS],
  template: `
    <div class="loading">
      <mat-progress-spinner mode="indeterminate" diameter="42"></mat-progress-spinner>
      <p>{{ message }}</p>
    </div>
  `,
  styles: [
    `
      .loading {
        display: grid;
        place-items: center;
        gap: 1rem;
        padding: 3rem 1rem;
        color: var(--color-muted);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingStateComponent {
  @Input() message = 'Cargando tablero...';
}
