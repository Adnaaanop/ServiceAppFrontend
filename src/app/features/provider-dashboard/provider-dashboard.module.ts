import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderDashboardRoutingModule } from './provider-dashboard-routing.module';
import { ProviderDashboardComponent } from './provider-dashboard.component';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { LayoutModule } from '../layout/layout.module';
import { FormsModule } from '@angular/forms';
import { MyServicesComponent } from './components/my-services/my-services.component';
import { ProviderBookingsComponent } from './components/bookings/provider-bookings.component';

@NgModule({
  declarations: [
    ProviderDashboardComponent,
    DashboardHomeComponent,
    MyServicesComponent,
    ProviderBookingsComponent 
    
  ],
  imports: [
    CommonModule,
    ProviderDashboardRoutingModule,
    LayoutModule,
    FormsModule
  ]
})
export class ProviderDashboardModule { }
