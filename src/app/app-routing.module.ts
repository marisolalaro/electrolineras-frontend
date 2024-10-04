import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { rutas } from './core/constants/rutas';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/login/login-routing.module').then(m => m.LoginRoutingModule),
  },
  {
    path: rutas.rutaPrincipal,
    loadComponent: () => import('./modules/content/content.component'),
    children: [
      {
        path: rutas.rutaDashboard,
        loadComponent: () => import('./modules/dashboard/dashboard.component'),
      },
      {
        path: rutas.rutaClientes,
        loadComponent: () => import('./modules/customers/customers.component'),
      },
      {
        path: rutas.rutaAdministradores,
        loadComponent: () => import('./modules/administrators/administrators.component'),
      },
      {
        path: rutas.rutaElectrolineras,
        loadComponent: () => import('./modules/electric-stations/electric-stations.component'),
      },
      {
        path: rutas.rutaElectrolinerasOnline + '/:id',
        loadComponent: () => import('./modules/electric-station-online/electric-station-online.component'),
      },
      {
        path: rutas.rutaTransacciones,
        loadComponent: () => import('./modules/transactions/transactions.component'),
      },
      {
        path: rutas.rutaFacturaTransferencias,
        loadComponent: () => import('./modules/invoice-purchase-sales/invoice-purchase-sales.component'),
      },
      {
        path: rutas.rutaFacturasCargasEnergia,
        loadComponent: () => import('./modules/invoice-energy-charging/invoice-energy-charging.component'),
      },
      {
        path: rutas.rutaReportes,
        loadComponent: () => import('./modules/reportes/reportes.component'),
      },
      {
        path: rutas.rutaParametricas + '/' + rutas.rutaModelo,
        loadComponent: () => import('./modules/parametrics/brand/brand.component'),
      },
    ]
  },

  // {
  //   path: '404', 
  //   loadComponent: () => import('./modules/not-found/not-found.component'),
  // },
  // { 
  //   path: '**', 
  //   loadComponent: () => import('./modules/not-found/not-found.component')
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
