import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProviderDashboardComponent } from './provider-dashboard.component';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { MyServicesComponent } from './components/my-services/my-services.component';
import { ProviderBookingsComponent } from './components/bookings/provider-bookings.component';
import { ProviderProfileComponent } from './components/profile/provider-profile.component';

const routes: Routes = [
  {
    path: '',
    component: ProviderDashboardComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: DashboardHomeComponent },
      { path: 'services', component: MyServicesComponent },
      { path: 'bookings', component: ProviderBookingsComponent },
      { path: 'profile', component: ProviderProfileComponent } 
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderDashboardRoutingModule { }
