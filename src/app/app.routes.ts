import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () =>
      import('./features/register/register').then(m => m.Register),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin').then(m => m.Admin),
  },
  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full',
  },
];