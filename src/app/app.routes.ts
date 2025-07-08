import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing').then(m => m.Landing),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin').then(m => m.Admin),
  },
];