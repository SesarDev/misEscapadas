import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AppCheckService } from './app-check.service';
import { RoomsStoreService } from '../../services/rooms-store.service';

@Injectable({ providedIn: 'root' })
export class AppBootstrapService {
  constructor(
    private readonly appCheckService: AppCheckService,
    private readonly authService: AuthService,
    private readonly roomsStore: RoomsStoreService
  ) {}

  async initialize(): Promise<void> {
    try {
      this.appCheckService.initialize();
    } catch (error) {
      console.error('Fallo inicializando App Check.', error);
    }

    try {
      await this.authService.ensureSession();
    } catch (error) {
      console.error('Fallo inicializando autenticación.', error);
    }

    try {
      await this.roomsStore.initialize();
    } catch (error) {
      console.error('Fallo cargando las salas. Se continuará con estado vacío/local.', error);
      this.roomsStore.loading.set(false);
    }
  }
}
