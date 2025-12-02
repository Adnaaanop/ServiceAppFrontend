import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDashboardComponent } from './user-dashboard.component';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';
import { UserDashboardRoutingModule } from './user-dashboard-routing.module';
import { NavbarComponent } from '../layout/navbar/navbar.component';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { LayoutModule } from '../layout/layout.module';

@NgModule({
  declarations: [
    UserDashboardComponent,
    DashboardHomeComponent
  ],
  imports: [
    CommonModule,
    UserDashboardRoutingModule,
    LayoutModule
  ]
})
export class UserDashboardModule { }
