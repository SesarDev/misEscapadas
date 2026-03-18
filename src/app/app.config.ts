import { APP_INITIALIZER, ApplicationConfig, EnvironmentProviders, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideServiceWorker } from '@angular/service-worker';
import { appRoutes } from './app.routes';
import { environment } from '@env/environment';
import { AppBootstrapService } from './core/services/app-bootstrap.service';
import { hasFirebaseConfig } from './core/firebase/firebase-utils';

function provideFirebase(): Array<EnvironmentProviders> {
  if (!hasFirebaseConfig(environment.firebase)) {
    return [];
  }

  return [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ];
}

function initializeApplication(bootstrap: AppBootstrapService) {
  return () => bootstrap.initialize();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideRouter(
      appRoutes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
    ),
    provideServiceWorker('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    }),
    ...provideFirebase(),
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AppBootstrapService],
      useFactory: initializeApplication
    }
  ]
};
