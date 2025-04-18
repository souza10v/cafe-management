import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuTrigger, MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ConfirmationComponent } from '../../material-component/dialog/confirmation/confirmation.component';
import { ChangePasswordComponent } from '../../material-component/dialog/change-password/change-password.component';


@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    RouterModule,
    CommonModule,
    MatMenuTrigger,
    MatMenuModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  role: any;
  constructor(private router: Router, private dialog: MatDialog) { }

  logout() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'Logout',
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe(
      (user: any) => {
        console.log("user", user)
        dialogRef.close();
        localStorage.clear();
        this.router.navigate(['/']);
      }
    );
  }

  changePassword() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    const dialogRef = this.dialog.open(ChangePasswordComponent, dialogConfig);
  }
}
