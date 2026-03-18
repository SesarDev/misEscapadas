import { Injectable, computed, signal } from '@angular/core';

const PIN_STORAGE_KEY = 'mis-escapadas.pin';
const PIN_UNLOCK_KEY = 'mis-escapadas.pin-unlocked';

@Injectable({ providedIn: 'root' })
export class PinService {
  private readonly pinValue = signal<string>(localStorage.getItem(PIN_STORAGE_KEY) ?? '');
  private readonly unlockedValue = signal<boolean>(localStorage.getItem(PIN_UNLOCK_KEY) === 'true');

  readonly hasPin = computed(() => this.pinValue().length > 0);

  isPinEnabled(): boolean {
    return this.hasPin();
  }

  isUnlocked(): boolean {
    return !this.hasPin() || this.unlockedValue();
  }

  getPinHint(): string {
    return this.hasPin() ? 'PIN activo' : 'Sin PIN';
  }

  savePin(pin: string): void {
    const sanitized = pin.trim();
    if (!sanitized) {
      localStorage.removeItem(PIN_STORAGE_KEY);
      this.pinValue.set('');
      this.lock();
      return;
    }

    localStorage.setItem(PIN_STORAGE_KEY, sanitized);
    this.pinValue.set(sanitized);
    this.unlock();
  }

  validate(pin: string): boolean {
    return this.pinValue() === pin.trim();
  }

  unlock(): void {
    localStorage.setItem(PIN_UNLOCK_KEY, 'true');
    this.unlockedValue.set(true);
  }

  lock(): void {
    localStorage.removeItem(PIN_UNLOCK_KEY);
    this.unlockedValue.set(false);
  }
}
