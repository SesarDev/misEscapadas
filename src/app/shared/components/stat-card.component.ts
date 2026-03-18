import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MATERIAL_IMPORTS } from '../material/material-imports';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [...MATERIAL_IMPORTS],
  template: `
    <mat-card class="stat-card">
      <mat-card-content>
        <p class="label">{{ label }}</p>
        <h3>{{ value }}</h3>
        <p class="supporting">{{ supporting }}</p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      .stat-card {
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
        border: 1px solid rgba(255, 255, 255, 0.08);
      }

      .label,
      .supporting {
        margin: 0;
      }

      .label {
        color: var(--color-muted);
        text-transform: uppercase;
        letter-spacing: 0.14em;
        font-size: 0.72rem;
      }

      h3 {
        margin: 0.35rem 0 0.15rem;
        font-family: var(--font-display);
        font-size: 2rem;
      }

      .supporting {
        color: var(--color-muted);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatCardComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: string | number;
  @Input() supporting = '';
}
