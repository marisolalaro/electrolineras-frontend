import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeModule } from 'src/app/prime.module';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { TransactionsRoutingModule } from './transactions-routing.module';
// services
import { TransactionsService } from './services/transactions.service';
import { NotFoundComponent } from '../not-found/not-found.component';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    PrimeModule,
    PipesModule,
    TransactionsRoutingModule,
    NotFoundComponent
  ],
  exports:[
    PrimeModule,
    NotFoundComponent
  ],
  providers: [
    TransactionsService,
  ]
})
export class TransactionsModule { }
