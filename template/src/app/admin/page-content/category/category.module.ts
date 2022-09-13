import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryCreateComponent } from './category-create/category-create.component';
import { CategoryUpdateComponent } from './category-update/category-update.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
       CategoryListComponent,
       CategoryCreateComponent,
       CategoryUpdateComponent
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,

  ]
})
export class CategoryModule { }
