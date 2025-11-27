import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: 'auth',
    loadChildren: () => import('./features/authentication/authentication-module').then(m => m.AuthenticationModule)
},
 {
    path: 'services',
    loadChildren: () => import('./features/services/services-module').then(m => m.ServicesModule)
  },
  {
    path: 'bookings',
    loadChildren: () => import('./features/bookings/bookings-module').then(m => m.BookingsModule),
  },
  {
  path: 'dashboard',
  loadChildren: () => import('./features/user-dashboard/user-dashboard.module').then(m => m.UserDashboardModule)
},
 {
    path: 'provider/dashboard',
    loadChildren: () =>
      import('./features/provider-dashboard/provider-dashboard.module')
        .then(m => m.ProviderDashboardModule)
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
