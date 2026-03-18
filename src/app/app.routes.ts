import { Routes } from '@angular/router';
import { pinRedirectGuard, pinUnlockGuard } from './core/guards/pin.guard';

export const appRoutes: Routes = [
  {
    path: 'pin',
    canActivate: [pinRedirectGuard],
    loadComponent: () => import('./features/pin/pin.page').then((m) => m.PinPageComponent)
  },
  {
    path: '',
    canActivate: [pinUnlockGuard],
    loadComponent: () => import('./shared/layout/app-shell.component').then((m) => m.AppShellComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.page').then((m) => m.DashboardPageComponent)
      },
      {
        path: 'salas',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/rooms/pages/rooms-list.page').then((m) => m.RoomsListPageComponent)
          },
          {
            path: 'nueva',
            loadComponent: () => import('./features/rooms/pages/room-form.page').then((m) => m.RoomFormPageComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./features/rooms/pages/room-detail.page').then((m) => m.RoomDetailPageComponent)
          },
          {
            path: ':id/editar',
            loadComponent: () => import('./features/rooms/pages/room-form.page').then((m) => m.RoomFormPageComponent)
          }
        ]
      },
      {
        path: 'estadisticas',
        loadComponent: () => import('./features/stats/stats.page').then((m) => m.StatsPageComponent)
      },
      {
        path: 'ranking',
        loadComponent: () => import('./features/ranking/ranking.page').then((m) => m.RankingPageComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
