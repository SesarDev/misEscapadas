import { FirebaseOptions } from '@angular/fire/app';

export function hasFirebaseConfig(config: FirebaseOptions): boolean {
  return !!config.apiKey && !!config.projectId && !!config.appId;
}
