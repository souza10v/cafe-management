import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation',
  imports: [MatDialogModule],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent {

  onEmitStatusChange = new EventEmitter();
  details: any = {};

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any) {
  }

  ngOnInit(): void {
    if (this.dialogData) {
      this.details = this.dialogData;
    }
  }

  handleChangeAction(){
    this.onEmitStatusChange.emit();
  }
}
