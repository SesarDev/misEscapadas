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
    this.appCheckService.initialize();
    await this.authService.ensureSession();
    await this.roomsStore.initialize();
  }
}
