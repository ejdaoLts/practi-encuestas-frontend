import { Routes } from '@angular/router';
import { AuthGuard, GuestGuard } from '@shared/guards';
import { AccessControlComponent } from './layouts/access-control';
//import { AdminPanelComponent } from './layouts/admin-panel/admin-panel.component';

export const routes: Routes = [
  /* {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then(m => m.routes),
  }, */
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
    canActivate: [AuthGuard],
    //component: AdminPanelComponent,
    children: [
      {
        path: 'home',
        //loadChildren: () => import('@home/home.page.module').then(m => m.HomeModule),
        loadChildren: () => import('./tabs/tabs.routes').then(m => m.routes),
      },
    ],
  },
];
