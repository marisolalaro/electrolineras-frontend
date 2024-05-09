import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { PrimeModule } from 'src/app/prime.module';
import { AppFormatValueDirective } from 'src/app/core/directives/app-format-value.directive';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { messages } from 'src/app/core/constants/messages';
import { labels } from 'src/app/core/constants/labels';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss'],
  providers: [MessageService, HelpersService],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PrimeModule,
    PipesModule,
    AppFormatValueDirective,
  ],
})
export class ModalInfoComponent{
  @Input({ required: true }) serviceObject: any;
  @Input() fromGeneralToolbar: boolean = true;
  @Input() itsSummarized: boolean = true;
  @Input({ required: true }) columns: string[];

  public dialogInfo: boolean = false;
  public object: any;
  public messages = messages;
  public excludedColumns: string[] = [
    'id',
    'createdAt',
    'createdBy',
    'updatedAt',
    'updatedBy',
  ];

  constructor(private helpersService: HelpersService) {}

  async ngOnInit() {
    this.serviceObject.triggerInfo.emit(this);
    if(this.fromGeneralToolbar){
      await this.waitForObjectSelection();
    }
  }

  private async waitForObjectSelection() {
    return new Promise<void>((resolve) => {
      this.serviceObject
        .getObjectSelectedChange()
        .subscribe((response: typeof this.object) => {
          this.object = response;
          resolve();
        });
    });
  }

  public openInfo(data?: any) {
    if(data){
      this.object = data;
    }
    if(!this.itsSummarized){
      this.object = this.serviceObject.getSummarizedData(this.object);
      this.itsSummarized = true;
    }
    if (this.object && this.object.id) {
      this.dialogInfo = true;
    } else {
      this.helpersService.messageNotification(
        'info',
        messages.requiredSelection
      );
    }
  }

  public isVariableOfType(variable: any): string {
    return typeof variable;
  }

  public translateHeader(variable: string | any): string {
    return labels[variable] ? labels[variable] : variable;
  }

  public isColumnIncluded(columnName: string | any): boolean {
    return (
      !this.excludedColumns.includes(columnName) && !columnName.includes('Id')
    );
  }
}