import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardComponent } from './user-dashboard.component';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';

const routes: Routes = [
  {
    path: '',
    component: UserDashboardComponent,
    children: [
      { path: '', component: DashboardHomeComponent }, // Default dashboard home
      {
        path: 'bookings',
        loadChildren: () => import('../bookings/bookings-module').then((m) => m.BookingsModule),
      },
      {
        path: 'services',
        loadChildren: () => import('../services/services-module').then((m) => m.ServicesModule),
      },
      {
        path: 'messages',
        loadChildren: () => import('../messaging/messaging.module').then((m) => m.MessagingModule),
      },
      // Add other child routes as needed
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserDashboardRoutingModule {}
