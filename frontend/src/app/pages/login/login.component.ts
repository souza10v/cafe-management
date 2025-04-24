import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../../shared/global-constants';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserModels } from '../../../models/user.model';


@Component({
  selector: 'app-login',
  imports: [
    MatToolbarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm!: FormGroup;
  responseMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<LoginComponent>,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      password: [null, [Validators.required]]
    })
  }

  handleSubmit() {
    this.ngxService.start();
    const formData = this.loginForm.value;
  
    const data = {
      email: formData.email,
      password: formData.password
    };
  
    this.userService.login(data).subscribe({
      next: (response: UserModels.LoginResponse) => {
        this.ngxService.stop();
        this.dialogRef.close();
        localStorage.setItem('token', response?.token);
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    });
  }
  
}
