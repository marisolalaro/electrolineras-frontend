import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { rutas } from 'src/app/core/constants/rutas';

const routes: Routes = [
  {
    path: '',
    loadComponent : () => import('./electric-stations.component'),
  },
  {
    path: rutas.rutaOnlineElectricStation,
    loadComponent : () => import('./real-time/real-time.component'),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElectricStationsRoutingModule { }
