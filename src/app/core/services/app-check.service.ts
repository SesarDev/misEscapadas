import { Injectable } from '@angular/core';
import { getApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { environment } from '@env/environment';
import { hasFirebaseConfig } from '../firebase/firebase-utils';

@Injectable({ providedIn: 'root' })
export class AppCheckService {
  initialize(): void {
    if (!hasFirebaseConfig(environment.firebase) || !environment.appCheck.siteKey) {
      return;
    }

    if (!environment.production && environment.appCheck.debugToken) {
      (self as typeof self & { FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean | string }).FIREBASE_APPCHECK_DEBUG_TOKEN =
        environment.appCheck.debugToken;
    }

    initializeAppCheck(getApp(), {
      provider: new ReCaptchaV3Provider(environment.appCheck.siteKey),
      isTokenAutoRefreshEnabled: true
    });
  }
}
