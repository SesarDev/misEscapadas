import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PinService } from '../../core/services/pin.service';
import { MATERIAL_IMPORTS } from '../../shared/material/material-imports';

@Component({
  standalone: true,
  imports: [FormsModule, ...MATERIAL_IMPORTS],
  template: `
    <section class="pin-page">
      <mat-card class="pin-card">
        <mat-card-content>
          <p class="eyebrow">Privacidad visual</p>
          <h1>Protege la app con un PIN local</h1>
          <p class="copy">
            Este PIN solo oculta la interfaz en tu navegador. La seguridad real depende de Firebase Auth anónima, las reglas de Firestore y App Check.
          </p>

          @if (pinService.isPinEnabled()) {
            <mat-form-field appearance="outline">
              <mat-label>Introduce el PIN</mat-label>
              <input matInput type="password" [(ngModel)]="pinAttempt">
            </mat-form-field>
            <button mat-flat-button color="primary" type="button" (click)="unlock()">Desbloquear</button>
          } @else {
            <mat-form-field appearance="outline">
              <mat-label>Crear PIN local</mat-label>
              <input matInput type="password" [(ngModel)]="newPin">
            </mat-form-field>
            <button mat-flat-button color="primary" type="button" (click)="createPin()">Activar PIN</button>
            <button mat-button type="button" (click)="skip()">Continuar sin PIN</button>
          }

          @if (error()) {
            <p class="error">{{ error() }}</p>
          }
        </mat-card-content>
      </mat-card>
    </section>
  `,
  styles: [
    `
      .pin-page {
        min-height: 100dvh;
        display: grid;
        place-items: center;
        padding: 1rem;
      }

      .pin-card {
        width: min(100%, 28rem);
        background:
          radial-gradient(circle at top, rgba(214, 179, 111, 0.2), transparent 40%),
          rgba(9, 13, 21, 0.94);
        border: 1px solid rgba(255, 255, 255, 0.08);
      }

      .eyebrow {
        margin: 0;
        color: var(--color-accent);
        text-transform: uppercase;
        letter-spacing: 0.16em;
        font-size: 0.72rem;
      }

      h1 {
        margin: 0.5rem 0;
      }

      .copy,
      .error {
        color: var(--color-muted);
      }

      .error {
        color: #ffb4ab;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PinPageComponent {
  readonly pinService = inject(PinService);
  private readonly router = inject(Router);

  readonly error = signal('');
  pinAttempt = '';
  newPin = '';

  async unlock(): Promise<void> {
    if (!this.pinService.validate(this.pinAttempt)) {
      this.error.set('PIN incorrecto.');
      return;
    }

    this.pinService.unlock();
    await this.router.navigateByUrl('/dashboard');
  }

  async createPin(): Promise<void> {
    if (this.newPin.trim().length < 4) {
      this.error.set('Usa al menos 4 dígitos o caracteres.');
      return;
    }

    this.pinService.savePin(this.newPin);
    await this.router.navigateByUrl('/dashboard');
  }

  async skip(): Promise<void> {
    await this.router.navigateByUrl('/dashboard');
  }
}
