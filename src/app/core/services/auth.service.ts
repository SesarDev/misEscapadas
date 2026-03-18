import { Injectable, Optional, inject, signal } from '@angular/core';
import { Auth, User, browserLocalPersistence, onAuthStateChanged, setPersistence, signInAnonymously } from '@angular/fire/auth';
import { hasFirebaseConfig } from '../firebase/firebase-utils';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth, { optional: true });

  readonly currentUser = signal<User | null>(null);
  readonly ready = signal(false);
  readonly usingFirebase = hasFirebaseConfig(environment.firebase);

  async ensureSession(): Promise<void> {
    if (!this.usingFirebase || !this.auth) {
      this.ready.set(true);
      return;
    }

    const auth = this.auth;

    await setPersistence(auth, browserLocalPersistence);

    await new Promise<void>((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(
        auth,
        async (user) => {
          this.currentUser.set(user);

          if (!user) {
            try {
              await signInAnonymously(auth as Auth);
              return;
            } catch (error) {
              reject(error);
              unsubscribe();
              return;
            }
          }

          this.ready.set(true);
          unsubscribe();
          resolve();
        },
        reject
      );
    });
  }
}
