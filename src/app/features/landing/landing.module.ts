import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing.component';

@NgModule({
  declarations: [LandingComponent],
  imports: [
    CommonModule
    // Add other modules if needed (e.g., RouterModule if you use routerLink)
  ],
  exports: [LandingComponent]
})
export class LandingModule { }
