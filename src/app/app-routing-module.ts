import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
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
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
