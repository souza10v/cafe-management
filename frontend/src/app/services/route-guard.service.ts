import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; 
import { SnackbarService } from './snackbar.service';
import { GlobalConstants } from '../shared/global-constants';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(
    public auth: AuthService,
    public router: Router,
    private snackbarService: SnackbarService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoleArray: string[] = route.data['expectedRole']; 
    const token = localStorage.getItem('token');

    if (!token) {
      localStorage.clear();
      this.router.navigate(['/']);
      return false;
    }

    let tokenPayload: any = null;
    try {
      tokenPayload = jwtDecode(token); 
    } catch (err) {
      localStorage.clear();
      this.router.navigate(['/']);
      return false;
    }

    const hasRequiredRole = expectedRoleArray.includes(tokenPayload.role);

    if ((tokenPayload.role === 'user' || tokenPayload.role === 'admin') && this.auth.isAuthenticated() && hasRequiredRole) {
      return true;
    } else {
      this.snackbarService.openSnackBar(GlobalConstants.unauthorized, GlobalConstants.error);
      this.router.navigate(['/']);
      localStorage.clear();
      return false;
    }
  }
}
