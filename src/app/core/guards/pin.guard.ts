import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PinService } from '../services/pin.service';

export const pinUnlockGuard: CanActivateFn = () => {
  const pinService = inject(PinService);
  const router = inject(Router);

  if (!pinService.isPinEnabled() || pinService.isUnlocked()) {
    return true;
  }

  return router.createUrlTree(['/pin']);
};

export const pinRedirectGuard: CanActivateFn = () => {
  const pinService = inject(PinService);
  const router = inject(Router);

  if (!pinService.isPinEnabled() || pinService.isUnlocked()) {
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};
