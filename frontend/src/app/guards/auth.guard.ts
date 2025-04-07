import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const snackbarService = inject(SnackbarService);

  const token = localStorage.getItem('token');

  if (token) {
    return true;
  } else {
    snackbarService.openSnackBar(GlobalConstants.unauthorized, GlobalConstants.error);
    router.navigate(['/']);
    return false;
  }
};
