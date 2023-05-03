import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./tab2/tab2.page').then(m => m.Tab2Page),
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
        redirectTo: '/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];
