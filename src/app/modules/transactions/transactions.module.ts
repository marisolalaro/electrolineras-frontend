import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeModule } from 'src/app/prime.module';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { TransactionsRoutingModule } from './transactions-routing.module';
// services
import { TransactionsService } from './services/transactions.service';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    PrimeModule,
    PipesModule,
    TransactionsRoutingModule,
  ],
  exports:[
    PrimeModule
  ],
  providers: [
    TransactionsService,
  ]
})
export class TransactionsModule { }
