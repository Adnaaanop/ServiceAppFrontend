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
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
