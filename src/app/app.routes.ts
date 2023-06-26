import { Routes } from '@angular/router';
import { AuthGuard, GuestGuard } from '@shared/guards';
import { AccessControlComponent } from './layouts/access-control';
import { AdminLayoutComponent } from './admin-layout';
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
];
