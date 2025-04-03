import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from "./menu/menu.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent, DashboardComponent, NgxUiLoaderModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
