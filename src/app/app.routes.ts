import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'my-page',
    loadComponent: () =>
      import('./components/my-page/my-page.component').then(m => m.MyPageComponent)
  },
  {
    path: '',
    redirectTo: 'my-page',
    pathMatch: 'full'
  }
];
