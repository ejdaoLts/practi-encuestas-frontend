import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./tab1/tab1.page').then(m => m.Tab1Page),
      },
      {
        path: 'tab2',
        loadComponent: () => import('./tab2/tab2.page').then(m => m.Tab2Page),
      },
      {
        path: 'evaluaciones',
        loadComponent: () =>
          import('./evaluaciones/evaluaciones.page').then(m => m.EvaluacionesPage),
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full',
  },
];
