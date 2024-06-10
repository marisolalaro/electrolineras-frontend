import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeModule } from 'src/app/prime.module';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { FilterInformationComponent } from 'src/app/shared/components/filter-information/filter-information.component';
import { TransactionsService } from './services/transactions.service';

@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    PrimeModule,
    PipesModule,
    TransactionsRoutingModule,
    FilterInformationComponent,
  ],
  exports:[
    PrimeModule
  ],
  providers: [
    TransactionsService,
  ]
})
export class TransactionsModule { }
