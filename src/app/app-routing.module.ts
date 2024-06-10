import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/login/login-routing.module').then(m => m.LoginRoutingModule),
  },
  {
    path: 'administration',
    loadComponent: () => import('./modules/content/content.component'),
    children: [
      {
        path: 'customers',
        loadComponent: () => import('./modules/customers/customers.component'),
      },
      {
        path: 'administrators',
        loadComponent: () => import('./modules/administrators/administrators.component'),
      },
      {
        path: 'electric-stations',
        loadComponent: () => import('./modules/electric-stations/electric-stations.component'),
      },
      {
        path: 'transactions',
        loadComponent: () => import('./modules/transactions/transactions.component'),
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
