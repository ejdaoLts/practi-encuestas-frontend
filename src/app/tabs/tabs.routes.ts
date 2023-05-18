import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'personas',
        loadComponent: () => import('./personas/personas.page').then(m => m.PersonasPage),
      },
      {
        path: 'entidades',
        loadComponent: () => import('./entidades/entidades.page').then(m => m.EntidadesPage),
      },
      {
        path: 'evaluaciones',
        loadComponent: () =>
          import('./evaluaciones/evaluaciones.page').then(m => m.EvaluacionesPage),
      },
      {
        path: '',
        redirectTo: '/personas',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/personas',
    pathMatch: 'full',
  },
];
