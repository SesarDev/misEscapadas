import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MATERIAL_IMPORTS } from '../material/material-imports';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [...MATERIAL_IMPORTS],
  template: `
    <mat-card class="empty-state">
      <mat-card-content>
        <mat-icon>{{ icon }}</mat-icon>
        <h3>{{ title }}</h3>
        <p>{{ description }}</p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .empty-state {
        text-align: center;
        border: 1px dashed rgba(255, 255, 255, 0.18);
        background: rgba(255, 255, 255, 0.02);
      }

      mat-icon {
        width: 2.5rem;
        height: 2.5rem;
        font-size: 2.5rem;
        color: var(--color-accent);
      }

      h3 {
        margin-bottom: 0.35rem;
      }

      p {
        margin: 0;
        color: var(--color-muted);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyStateComponent {
  @Input() icon = 'search_off';
  @Input() title = 'Sin resultados';
  @Input() description = 'Prueba ajustando filtros o añadiendo nuevas salas.';
}
