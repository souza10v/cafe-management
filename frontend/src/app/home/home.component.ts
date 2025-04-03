import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule, MatToolbarModule, MatDialogModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  signupAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(SignupComponent, dialogConfig);
  }

  loginAction() {
    console.log('teste');
  }
}
