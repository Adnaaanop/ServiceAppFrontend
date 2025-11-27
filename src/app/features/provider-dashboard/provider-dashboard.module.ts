import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderDashboardRoutingModule } from './provider-dashboard-routing.module';
import { ProviderDashboardComponent } from './provider-dashboard.component';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';

@NgModule({
  declarations: [
    ProviderDashboardComponent,
    DashboardHomeComponent
  ],
  imports: [
    CommonModule,
    ProviderDashboardRoutingModule
  ]
})
export class ProviderDashboardModule { }
