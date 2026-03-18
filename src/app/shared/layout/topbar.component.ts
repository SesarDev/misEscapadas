import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PinService } from '../../core/services/pin.service';
import { RoomsStoreService } from '../../services/rooms-store.service';
import { MATERIAL_IMPORTS } from '../material/material-imports';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink, ...MATERIAL_IMPORTS],
  template: `
    <header class="topbar">
      <div>
        <p class="eyebrow">Cuaderno personal</p>
        <a routerLink="/dashboard" class="brand">Mis Escapadas</a>
      </div>

      <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Abrir acciones rápidas">
        <mat-icon>more_horiz</mat-icon>
      </button>
    </header>

    <mat-menu #menu="matMenu">
      <button mat-menu-item routerLink="/salas/nueva">
        <mat-icon>add_circle</mat-icon>
        <span>Nueva sala</span>
      </button>
      <button mat-menu-item type="button" (click)="seedDemo()">
        <mat-icon>auto_fix_high</mat-icon>
        <span>Recargar seed</span>
      </button>
      <button mat-menu-item type="button" (click)="lockPin()" [disabled]="!pinEnabled()">
        <mat-icon>lock</mat-icon>
        <span>Bloquear con PIN</span>
      </button>
      <button mat-menu-item type="button" (click)="clearAll()">
        <mat-icon>delete_sweep</mat-icon>
        <span>Borrar datos</span>
      </button>
    </mat-menu>
  `,
  styles: [
    `
      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 1.25rem 1rem 0.75rem;
      }

      .eyebrow {
        margin: 0 0 0.15rem;
        color: var(--color-accent);
        font-size: 0.75rem;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }

      .brand {
        color: var(--color-text);
        text-decoration: none;
        font-family: var(--font-display);
        font-size: 2rem;
        line-height: 1;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent {
  private readonly roomsStore = inject(RoomsStoreService);
  private readonly pinService = inject(PinService);
  private readonly router = inject(Router);

  readonly pinEnabled = computed(() => this.pinService.isPinEnabled());

  async seedDemo(): Promise<void> {
    await this.roomsStore.seedDemoData();
  }

  async lockPin(): Promise<void> {
    this.pinService.lock();
    await this.router.navigateByUrl('/pin');
  }

  async clearAll(): Promise<void> {
    await this.roomsStore.clearAllData();
  }
}
