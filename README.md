# Mis Escapadas

Aplicacion web movil-first para gestionar tu listado personal de escape rooms fisicas. Incluye historial de salas jugadas, wishlist, valoraciones detalladas, ranking, estadisticas, favoritos, PWA instalable y backend listo para Firebase.

## Stack

- Angular 19 con standalone components
- TypeScript estricto
- Angular Material personalizado
- Firebase Hosting
- Cloud Firestore
- Firebase Authentication anonima
- Firebase App Check
- PWA con service worker
- Tests basicos con Jasmine/Karma

## Caracteristicas

- Dashboard con resumen visual y accesos rapidos
- Listado con busqueda, filtros combinables y ordenacion
- Formulario reactivo dinamico segun estado `done` o `wishlist`
- Detalle completo de sala con valoraciones y notas
- Estadisticas personales
- Ranking configurable
- Favoritos
- PIN local opcional para privacidad visual
- Seed inicial recargable y eliminable

## Arquitectura

La app sigue una estructura feature-based:

- `src/app/core`: bootstrap, guards, auth y utilidades base
- `src/app/shared`: layout, componentes reutilizables y Material imports
- `src/app/features`: dashboard, rooms, stats, ranking y pin
- `src/app/models`: modelos de dominio y contratos tipados
- `src/app/services`: repositorio, store, seed y helpers
- `src/environments`: configuracion por entorno

Decisiones principales:

- standalone components en toda la app
- lazy loading por pantallas
- Reactive Forms
- signals para estado de UI y selectors
- logica concentrada en servicios/store
- filtros y ranking en cliente, adecuados para una app personal

## Instalacion

```bash
npm install
```

## Desarrollo

```bash
npm start
```

La aplicacion puede arrancar sin credenciales reales de Firebase. En ese caso usa `localStorage` como fallback para que puedas validar UI y flujos rapidamente. En este proyecto ya esta cargada la configuracion de `misescapadas-8b1df`, pero App Check sigue necesitando su `siteKey` real para activarse por completo.

## Configuracion Firebase

1. Crea un proyecto en Firebase.
2. Activa Authentication con proveedor anonimo.
3. Crea Firestore en modo produccion.
4. Verifica o ajusta las credenciales web en:
   - `src/environments/environment.ts`
   - `src/environments/environment.prod.ts`
5. Configura App Check con reCAPTCHA v3 y coloca la `siteKey`.
6. Copia `.firebaserc.example` a `.firebaserc` y cambia el id del proyecto si fuera necesario.

Ejemplo de campos necesarios:

```ts
firebase: {
  apiKey: '...',
  authDomain: '...',
  projectId: '...',
  storageBucket: '...',
  messagingSenderId: '...',
  appId: '...'
},
appCheck: {
  siteKey: 'TU_RECAPTCHA_V3_SITE_KEY',
  debugToken: true
}
```

## Seguridad

La seguridad real de la app se apoya en tres capas:

1. Firebase Authentication anonima
   - login automatico al arrancar
   - persistencia local de sesion
   - sin interaccion del usuario
2. Firestore Security Rules
   - todas las operaciones requieren `request.auth != null`
   - validacion de estructura minima del documento
3. Firebase App Check
   - preparado para reCAPTCHA v3
   - admite `debugToken` en desarrollo
   - requiere que completes la `siteKey`, que no viene en la configuracion web basica

### PIN local

El PIN es solo una capa de privacidad visual en el navegador y se guarda en `localStorage`.

- No protege los datos frente a accesos tecnicos
- No sustituye a Auth, Rules ni App Check
- Sirve para ocultar la interfaz cuando compartes dispositivo

## Firestore

Coleccion usada:

- `escapeRooms`

Cada documento sigue el modelo pedido en el enunciado, incluyendo `ratings` y `meta`.

## Reglas Firestore

El archivo [firestore.rules](/C:/Users/PC/Desktop/OPENAI/MisEscapadas/firestore.rules) exige autenticacion y valida la forma principal del documento.

Despliegue de reglas:

```bash
firebase deploy --only firestore:rules
```

## PWA

La app incluye:

- `manifest.webmanifest`
- `ngsw-config.json`
- service worker de Angular
- iconos base
- instalacion en movil y escritorio compatibles

Build de produccion:

```bash
npm run build:prod
```

## Deploy en Firebase Hosting

```bash
npm run build:prod
firebase deploy --only hosting,firestore
```

## Tests

```bash
npm test
```

Cobertura incluida:

- helper de calculo, filtros y ordenacion
- smoke test del dashboard

## Datos de ejemplo

La aplicacion carga un seed inicial automaticamente cuando no encuentra datos.

Opciones disponibles desde la UI:

- recargar seed
- borrar datos

## GitHub Ready

Sugerencia de ramas:

- `main`: produccion
- `develop`: integracion
- `feature/*`: nuevas funcionalidades
- `fix/*`: correcciones
- `codex/*`: trabajo asistido

Commits sugeridos:

1. `chore: bootstrap angular 19 pwa app`
2. `feat: add rooms domain with dashboard ranking and stats`
3. `feat: integrate firebase auth firestore and app check`
4. `docs: add deployment and security guide`

## Checklist de deploy

- `environment.prod.ts` revisado
- App Check activado en Firebase
- `siteKey` de reCAPTCHA v3 añadida
- Auth anonima habilitada
- Firestore rules desplegadas
- `npm run build:prod` correcto
- Hosting apuntando a `dist/mis-escapadas/browser`

## Limitaciones actuales

- Uso pensado para un unico usuario real
- Sin subida de imagenes
- Sin import/export
- Sin multiusuario
- Sin login por email/password

## Mejoras futuras

- graficas avanzadas
- backups cifrados
- tags personalizados
- notas por jugador
- historial de revisitas
