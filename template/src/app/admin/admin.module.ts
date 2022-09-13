import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminMainComponent } from './admin-main/admin-main.component';
import { DashboardComponent } from './page-content/dashboard/dashboard.component';
import { AdminRoutingModule } from './admin-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FormsModule } from '@angular/forms';
import { SlugifyPipe } from './pipes/slugify.pipe';


@NgModule({
  declarations: [
    AdminMainComponent,
    DashboardComponent,
    PageNotFoundComponent,
    SlugifyPipe,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule

  ]
})
export class AdminModule { }
