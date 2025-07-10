import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'landing',
    loadComponent: () =>
      import('./features/landing/landing').then(m => m.Landing),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard').then(m => m.Dashboard),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }
];