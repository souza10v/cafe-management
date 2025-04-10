import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { authGuard } from './guards/auth.guard';
import { RouteGuardService } from './services/route-guard.service';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'dashboard',
        component: MenuComponent,
        //canActivate: [authGuard]
        canActivate:[RouteGuardService],
        data: {
            expectedRole: ['admin', 'user']
        }
    }
];
