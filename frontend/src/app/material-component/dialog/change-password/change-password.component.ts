import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarService } from '../../../services/snackbar.service';
import { GlobalConstants } from '../../../shared/global-constants';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { UserModels } from '../../../../models/user.model';
@Component({
  selector: 'app-change-password',
  imports: [    
    MatToolbarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  changePasswordForm: any = FormGroup;
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
  ){}

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: [null,Validators.required],
      newPassword: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    })
  }

  validateSubmit(){
    if(this.changePasswordForm.controls['newPassword'].value !== this.changePasswordForm.controls['confirmPassword'].value){
      return true;
    } else{
      return false;
    }
  }

  handleChangePasswordSubmit(){
    this.ngxService.start();
    const formData = this.changePasswordForm.value;
    const data = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword
    }

    this.userService.changePassword(data).subscribe({
      next: (response: UserModels.ChangePasswordResponse) => {
        this.ngxService.stop();
        this.responseMessage = response.message;
        this.dialogRef.close();
        this.snackbarService.openSnackBar(this.responseMessage, 'success');
      },
      error: (error) => {
        this.ngxService.stop();
        console.log(error);
        if(error.error?.message){
          this.responseMessage = error.error.message;
        }
        else{
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    })
  }
}
