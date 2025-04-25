import { Injectable } from "@angular/core";

export interface Menu {
    state: string;
    name: string;
    icon: string;
    role: string;
}

const MENUITEMS = [
    {state: 'dashboard', name: 'Dashboard', icon: 'dashboard', role: ''},
    {state: 'dashboard/category', name: 'Category', icon: 'category', role: 'admin'},
    {state: 'dashboard/product', name: 'Manage Product', icon: 'inventory_2', role: 'admin'},
    {state: 'dashboard/order', name: 'Manage Orger', icon: 'list_alt', role: ''}
];


@Injectable()
export class MenuItems {
    getMenuItems(): Menu[] {
        return MENUITEMS;
    }
}