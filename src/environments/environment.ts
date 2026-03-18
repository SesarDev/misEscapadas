import { FirebaseOptions } from '@angular/fire/app';

export interface AppEnvironment {
  production: boolean;
  firebase: FirebaseOptions;
  appCheck: {
    siteKey: string;
    debugToken: boolean | string;
  };
}

export const environment: AppEnvironment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAfJJEUHEUzD9f4sinKcNKTUpEHgWQ8am8',
    authDomain: 'misescapadas-8b1df.firebaseapp.com',
    projectId: 'misescapadas-8b1df',
    storageBucket: 'misescapadas-8b1df.firebasestorage.app',
    messagingSenderId: '92832154994',
    appId: '1:92832154994:web:9364e43a5069a7bf0e09eb'
  },
  appCheck: {
    siteKey: '',
    debugToken: true
  }
};
