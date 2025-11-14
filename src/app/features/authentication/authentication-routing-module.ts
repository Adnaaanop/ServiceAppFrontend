import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// User components
import { LoginComponent } from './components/user/login/login.component';
import { RegisterComponent } from './components/user/register/register.component';
import { ProfileComponent } from './components/user/profile/profile.component';

// Provider components
import { ProviderRegisterComponent } from './components/provider/provider-register/provider-register.component';
import { ProviderProfileComponent } from './components/provider/provider-profile/provider-profile.component';

// Admin components
import { AdminApprovalComponent } from './components/admin/admin-approval/admin-approval.component';

const routes: Routes = [
   { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },

  // Provider routes
  { path: 'provider/register', component: ProviderRegisterComponent },
  { path: 'provider/profile', component: ProviderProfileComponent },

  // Admin routes
  { path: 'admin/approval', component: AdminApprovalComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
