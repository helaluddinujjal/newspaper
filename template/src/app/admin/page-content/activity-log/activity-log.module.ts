import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivityLogRoutingModule } from './activity-log-routing.module';
import { ListComponent } from './list/list.component';


@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    ActivityLogRoutingModule
  ]
})
export class ActivityLogModule { }
