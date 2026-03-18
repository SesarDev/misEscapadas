import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MATERIAL_IMPORTS } from '../material/material-imports';
import { TopbarComponent } from './topbar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TopbarComponent, ...MATERIAL_IMPORTS],
  template: `
    <div class="shell">
      <app-topbar />

      <main class="shell__content">
        <router-outlet />
      </main>

      <nav class="shell__nav">
        <a mat-button routerLink="/dashboard" routerLinkActive="active">Inicio</a>
        <a mat-button routerLink="/salas" routerLinkActive="active">Salas</a>
        <a mat-button routerLink="/ranking" routerLinkActive="active">Ranking</a>
        <a mat-button routerLink="/estadisticas" routerLinkActive="active">Stats</a>
      </nav>
    </div>
  `,
  styles: [
    `
      .shell {
        min-height: 100dvh;
        display: grid;
        grid-template-rows: auto 1fr auto;
        max-width: 980px;
        margin: 0 auto;
      }

      .shell__content {
        padding: 0 1rem 6rem;
      }

      .shell__nav {
        position: sticky;
        bottom: 0;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.5rem;
        padding: 0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom));
        background: rgba(8, 11, 19, 0.88);
        backdrop-filter: blur(16px);
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }

      .shell__nav a {
        border-radius: 999px;
        color: var(--color-muted);
      }

      .shell__nav a.active {
        background: rgba(214, 179, 111, 0.16);
        color: var(--color-text);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppShellComponent {}
