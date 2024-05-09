import { Component, Input } from '@angular/core';
import { tap, catchError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { HelpersService } from 'src/app/core/services/helpers.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { PrimeModule } from 'src/app/prime.module';
import { messages } from 'src/app/core/constants/messages';

@Component({
  selector: 'app-modal-delete',
  templateUrl: './modal-delete.component.html',
  styleUrls: ['./modal-delete.component.scss'],
  providers: [MessageService, HelpersService],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PrimeModule, PipesModule],
})
export class ModalDeleteComponent {
  @Input() serviceObject: any;
  @Input() fromGeneralToolbar: boolean = true;
  @Input({ required: false }) valueMessage: string;

  public object: any;
  public messages = messages;
  public dialog: boolean = false;
  private tableComponent: any;

  constructor(private helpersService: HelpersService) {}

  ngOnInit() {
    this.serviceObject.triggerDelete.emit(this);
    this.serviceObject.triggerTable.subscribe((tableComponent: any) => {
      this.tableComponent = tableComponent;
    });

    if (this.fromGeneralToolbar) {
      this.serviceObject
        .getObjectSelectedChange()
        .subscribe((response: typeof this.object) => {
          this.object = response;
        });
    }
  }

  public openConfirm(data?: any) {
    if (data) {
      this.object = data;
    }
    if (this.object && this.object.id) {
      this.openDialog(true);
    } else {
      this.helpersService.messageNotification(
        'info',
        messages.requiredSelection
      );
    }
  }

  public confirmDelete() {
    this.openDialog(false);
    this.serviceObject
      .delete(parseInt(this.object.id))
      .pipe(
        tap(() => {
          this.tableComponent.reload();
          this.fromGeneralToolbar
            ? this.helpersService.messageNotification(
                'success',
                messages.successDelete
              )
            : this.tableComponent.showMessage(
                'success',
                messages.successDelete
              );
          this.tableComponent.onRowUnselect(null);
        }),
        catchError(async (err) => {
          this.helpersService.messageNotification('error', err[0]);
        })
      )
      .subscribe();
  }

  public openDialog(state: boolean) {
    this.dialog = state;
  }
}