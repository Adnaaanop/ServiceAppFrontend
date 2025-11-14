import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceListComponent } from './components/service-list/service-list.component';
import { ServicesRoutingModule } from './services-routing-module';
import { HttpClientModule } from '@angular/common/http';
import { ServiceCardComponent } from './components/service-card/service-card.component';
import { ServiceDetailsComponent } from './components/service-details/service-details.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ServiceListComponent,
    ServiceCardComponent,
    ServiceDetailsComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ServicesRoutingModule,
    FormsModule
  ]
})
export class ServicesModule { }
