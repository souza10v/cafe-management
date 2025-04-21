import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { RouteGuardService } from './services/route-guard.service';
import { ManageCategoryComponent } from './material-component/manage-category/manage-category.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'dashboard',
        component: MenuComponent, 
        canActivate: [RouteGuardService],
        data: { expectedRole: ['admin', 'user'] },
        children: [ 
            {
                path: '',
                component: DashboardComponent 
            },
            {
                path: 'category', 
                component: ManageCategoryComponent,
                canActivate: [RouteGuardService],
                data: { expectedRole: ['admin'] }
            }
        ]
    }
];
