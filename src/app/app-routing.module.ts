import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/login/login-routing.module').then(m => m.LoginRoutingModule),
  },
  {
    // TODO 
    path: 'epagos-egsa',
    loadComponent: () => import('./modules/content/content.component'),
    children: [
      {
        path: 'customers',
        loadComponent: () => import('./modules/customers/customers.component'),
      },
      {
        path: 'users',
        loadComponent: () => import('./modules/categories/categories.component'),
      },
      {
        path: 'electric-stations',
        loadComponent: () => import('./modules/products/products.component'),
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
