import { Routes } from '@angular/router';
import { AuthGuard, GuestGuard } from '@shared/guards';
import { AccessControlComponent } from './layouts/access-control';
import { AdminLayoutComponent } from './admin-layout';
import { AdminPanelComponent } from './layouts/admin-panel/admin-panel.component';
import { EvaluacionesPage } from './public/evaluaciones/evaluaciones.page';
//import { AdminPanelComponent } from './layouts/admin-panel/admin-panel.component';

export const routes: Routes = [
  { path: '', redirectTo: 'access-control/login', pathMatch: 'full' },
  {
    path: '',
    component: AccessControlComponent,
    canActivate: [GuestGuard],
    children: [
      {
        path: 'access-control',
        loadChildren: () => import('@auth/auth.module').then(m => m.AuthModule),
      },
    ],
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'personas',
        loadComponent: () => import('./modules/personas/personas.page').then(m => m.PersonasPage),
      },
      {
        path: 'entidades',
        loadComponent: () =>
          import('./modules/entidades/entidades.page').then(m => m.EntidadesPage),
      },
      {
        path: 'evaluaciones',
        loadComponent: () =>
          import('./modules/evaluaciones/evaluaciones.page').then(m => m.EvaluacionesPage),
      },
    ],
  },
  {
    path: 'public',
    component: AdminPanelComponent,
    children: [
      {
        path: 'evaluaciones',
        loadComponent: () =>
          import('./public/evaluaciones/evaluaciones.page').then(m => m.EvaluacionesPage),
      },
      {
        path: 'evaluaciones-entidades',
        loadComponent: () =>
          import('./public/eva-entidades/evaluaciones.page').then(m => m.EvaluacionesPage),
      },
    ],
  },
];
