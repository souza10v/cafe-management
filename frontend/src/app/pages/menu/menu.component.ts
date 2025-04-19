import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { DashboardComponent } from "../dashboard/dashboard.component";
import { jwtDecode } from 'jwt-decode';
import { MenuItems } from '../../shared/menu-items';
import { DashoboardService } from '../../services/dashoboard.service';
import { SnackbarService } from '../../services/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../../components/header/header.component";
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  providers: [MenuItems],
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    DashboardComponent,
    RouterModule,
    CommonModule,
    HeaderComponent
]
})
export class MenuComponent {
  private breakpointObserver = inject(BreakpointObserver);
  token: any = localStorage.getItem('token');
  tokenPayload: any;

  constructor(
    public menuItems: MenuItems,
    private dashboardService: DashoboardService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService
  ) {
    this.tokenPayload = jwtDecode(this.token);
    console.log('Token Payload:', this.tokenPayload);
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

    getRouterLink(path: string): any[] {
      return ['/', ...path.split('/')];
    }
    
}
