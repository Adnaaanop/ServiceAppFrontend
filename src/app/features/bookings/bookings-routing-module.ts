import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingPageComponent } from './components/booking-page/booking-page.component';
import { BookingHistoryComponent } from './components/booking-history/booking-history.component';

const routes: Routes = [
  { path: '', component: BookingHistoryComponent },
  { path: ':id/book', component: BookingPageComponent },
  { path: ':id', component: BookingPageComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingsRoutingModule {}
