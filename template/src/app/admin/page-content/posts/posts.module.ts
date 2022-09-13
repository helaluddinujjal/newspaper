import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostsRoutingModule } from './posts-routing.module';
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
    PostsRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,

    QuillModule.forRoot()
  ]
})
export class PostsModule { }
