import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { RoomsStoreService } from '../../../services/rooms-store.service';
import { RoomFormComponent } from '../components/room-form.component';
import { RoomFormValue } from '../../../models/room-form.model';

@Component({
  standalone: true,
  imports: [RoomFormComponent],
  template: `
    <section class="page-header">
      <p class="eyebrow">Formulario</p>
      <h1>{{ isEdit() ? 'Editar sala' : 'Nueva sala' }}</h1>
      <p>{{ isEdit() ? 'Refina notas, valoración o datos de sesión.' : 'Añade una sala hecha o pendiente con todos los detalles que quieras conservar.' }}</p>
    </section>

    <app-room-form [room]="room()" [submitLabel]="isEdit() ? 'Guardar cambios' : 'Crear sala'" (save)="save($event)" (cancel)="router.navigateByUrl('/salas')" />
  `,
  styles: [
    `
      .page-header {
        margin-bottom: 1rem;
      }

      .eyebrow {
        margin: 0 0 0.3rem;
        color: var(--color-accent);
        text-transform: uppercase;
        letter-spacing: 0.14em;
        font-size: 0.72rem;
      }

      p:last-child {
        color: var(--color-muted);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomFormPageComponent {
  readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(RoomsStoreService);

  private readonly roomId = toSignal(this.route.paramMap.pipe(map((params) => params.get('id'))), { initialValue: null });
  readonly room = computed(() => (this.roomId() ? this.store.findById(this.roomId() as string) : undefined));
  readonly isEdit = computed(() => !!this.roomId());

  async save(value: RoomFormValue): Promise<void> {
    const id = this.roomId();
    if (id) {
      await this.store.updateRoom(id, value);
      await this.router.navigateByUrl(`/salas/${id}`);
      return;
    }

    await this.store.createRoom(value);
    await this.router.navigateByUrl('/salas');
  }
}
