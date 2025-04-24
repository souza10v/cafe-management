import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
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
  selector: 'app-signup',
  imports: [
    MatToolbarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  signupForm: any = FormGroup;
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<SignupComponent>,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email: [null, [Validators.required, Validators.email]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      password: [null, [Validators.required]]
    })
  }

  handleSubmit() {
    console.log("Enviando formulário de cadastro...");
    this.ngxService.start();
  
    const formData = this.signupForm.value;
    const data = {
      name: formData.name,
      email: formData.email,
      phone: formData.contactNumber,
      password: formData.password,
      status: true,
      role: "user"
    };
  
    this.userService.signup(data).subscribe({
      next: (response: UserModels.SignupResponse) => {
        this.ngxService.stop();
        this.dialogRef.close();
        this.responseMessage = response?.message || 'Cadastro realizado com sucesso!';
        this.snackbarService.openSnackBar(this.responseMessage, "success");
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error.message;
        } else if (error.error?.error) {
          this.responseMessage = error.error.error;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    });
  }
  
}
