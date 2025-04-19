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
        component: MenuComponent, // MenuComponent será a tela principal para o dashboard
        canActivate: [RouteGuardService],
        data: { expectedRole: ['admin', 'user'] },
        children: [ // Aqui você configura as sub-rotas dentro do MenuComponent
            {
                path: '',
                component: DashboardComponent // Aqui o DashboardComponent será carregado dentro do MenuComponent
            },
            {
                path: 'category', // Exemplo de outra sub-rota
                component: ManageCategoryComponent,
                canActivate: [RouteGuardService],
                data: { expectedRole: ['admin'] }
            }
        ]
    }
];
