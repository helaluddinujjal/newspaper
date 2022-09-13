import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicPageRoutingModule } from './dynamic-page-routing.module';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { QuillModule } from 'ngx-quill'

@NgModule({
  declarations: [
    CreateComponent,
    EditComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    DynamicPageRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    QuillModule.forRoot()
  ]
})
export class DynamicPageModule { }
