import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { RouteGuardService } from './services/route-guard.service';
import { ManageCategoryComponent } from './material-component/manage-category/manage-category.component';
import { ManageProductComponent } from './material-component/manage-product/manage-product.component';
import { ManageOrderComponent } from './material-component/manage-order/manage-order.component';
import { ViewBillComponent } from './material-component/view-bill/view-bill.component';
import { ManageUserComponent } from './material-component/manage-user/manage-user.component';

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
            },
            {
                path: 'product', 
                component: ManageProductComponent,
                canActivate: [RouteGuardService],
                data: { expectedRole: ['admin'] }
            },
            {
                path: 'order', 
                component: ManageOrderComponent,
                canActivate: [RouteGuardService],
                data: { expectedRole: ['admin', 'user'] }
            },
            {
                path: 'bill', 
                component: ViewBillComponent,
                canActivate: [RouteGuardService],
                data: { expectedRole: ['admin', 'user'] }
            },
            {
                path: 'user', 
                component: ManageUserComponent,
                canActivate: [RouteGuardService],
                data: { expectedRole: ['admin'] }
            }
        ]
    }
];
