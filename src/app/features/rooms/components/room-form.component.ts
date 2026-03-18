import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EscapeRoom } from '../../../models/escape-room.model';
import { RoomFormValue } from '../../../models/room-form.model';
import { RoomFormFacade } from '../room-form.facade';
import { RatingInputComponent } from '../../../shared/components/rating-input.component';
import { MATERIAL_IMPORTS } from '../../../shared/material/material-imports';

@Component({
  selector: 'app-room-form',
  standalone: true,
  imports: [ReactiveFormsModule, RatingInputComponent, ...MATERIAL_IMPORTS],
  template: `
    <form class="room-form" [formGroup]="form" (ngSubmit)="submit()">
      <section class="group">
        <div>
          <p class="eyebrow">Ficha</p>
          <h2>Datos principales</h2>
        </div>

        <div class="grid">
          <mat-form-field appearance="outline"><mat-label>Nombre</mat-label><input matInput formControlName="name"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Empresa</mat-label><input matInput formControlName="company"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Ciudad</mat-label><input matInput formControlName="city"></mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Estado</mat-label>
            <mat-select formControlName="status">
              <mat-option value="done">Hecha</mat-option>
              <mat-option value="wishlist">Wishlist</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Dificultad</mat-label><input matInput formControlName="difficulty"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Temática</mat-label><input matInput formControlName="theme"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Nivel de miedo</mat-label><input matInput formControlName="fearLevel"></mat-form-field>
        </div>
      </section>

      @if (isDone()) {
        <section class="group">
          <div>
            <p class="eyebrow">Partida</p>
            <h2>Datos de la sesión</h2>
          </div>

          <div class="grid">
            <mat-form-field appearance="outline"><mat-label>Fecha</mat-label><input matInput type="date" formControlName="playedAt"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Jugadores</mat-label><input matInput type="number" min="1" formControlName="players"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Duración (min)</mat-label><input matInput type="number" min="15" step="5" formControlName="durationMinutes"></mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Precio</mat-label>
              <input matInput type="number" min="0" step="1" formControlName="price">
              <span matTextPrefix>€&nbsp;</span>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>¿La recomendarías?</mat-label>
              <mat-select formControlName="recommended">
                <mat-option [value]="true">Sí</mat-option>
                <mat-option [value]="false">No</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </section>

        <section class="group">
          <div>
            <p class="eyebrow">Valoración</p>
            <h2>Puntuación detallada</h2>
          </div>

          <div class="grid">
            <app-rating-input label="Historia" [control]="form.controls.history" />
            <app-rating-input label="Ambientación" [control]="form.controls.ambience" />
            <app-rating-input label="Gameplay" [control]="form.controls.gameplay" />
            <app-rating-input label="Game master" [control]="form.controls.gameMaster" />
            <app-rating-input label="Inmersión" [control]="form.controls.immersion" />
            <app-rating-input label="Puzles" [control]="form.controls.puzzles" />
          </div>

          <div class="overall">
            <span>Media automática</span>
            <strong>{{ overall() ?? 'Pendiente' }}</strong>
          </div>
        </section>
      }

      <section class="group">
        <div>
          <p class="eyebrow">Notas</p>
          <h2>Impresiones personales</h2>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Notas</mat-label>
          <textarea matInput rows="6" formControlName="notes"></textarea>
        </mat-form-field>

        <mat-slide-toggle formControlName="isFavorite">Marcar como favorita</mat-slide-toggle>
      </section>

      <div class="actions">
        <button mat-stroked-button type="button" (click)="cancel.emit()">Cancelar</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">{{ submitLabel }}</button>
      </div>
    </form>
  `,
  styles: [
    `
      .room-form,
      .group {
        display: grid;
        gap: 1rem;
      }

      .group {
        padding: 1.25rem;
        border-radius: 1.4rem;
        background: rgba(255, 255, 255, 0.035);
        border: 1px solid rgba(255, 255, 255, 0.08);
      }

      .grid {
        display: grid;
        gap: 0.75rem;
      }

      .eyebrow {
        margin: 0;
        color: var(--color-accent);
        text-transform: uppercase;
        letter-spacing: 0.16em;
        font-size: 0.72rem;
      }

      h2 {
        margin: 0.2rem 0 0;
      }

      .overall,
      .actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
      }

      .overall strong {
        font-size: 2rem;
        font-family: var(--font-display);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomFormComponent {
  private readonly facade = inject(RoomFormFacade);

  @Input() set room(value: EscapeRoom | undefined) {
    this.form.reset(this.facade.createForm(value).getRawValue());
  }

  @Input() submitLabel = 'Guardar';
  @Output() save = new EventEmitter<RoomFormValue>();
  @Output() cancel = new EventEmitter<void>();

  readonly form = this.facade.createForm();
  readonly overall = computed(() => this.facade.getOverall(this.facade.toBusinessValue(this.form.getRawValue())));
  readonly isDone = computed(() => this.form.controls.status.value === 'done');

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit(this.facade.toBusinessValue(this.form.getRawValue()));
  }
}
