import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontendRoutingModule } from './frontend-routing.module';
import { HomeComponent } from './content/home/home.component';
import { PageNotFoundComponent } from './content/page-not-found/page-not-found.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { FlashNewsComponent } from './layout/flash-news/flash-news.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { PageContentComponent } from './content/page-content/page-content.component';
import { CategoryContentComponent } from './content/category-content/category-content.component';
import { PostDetailComponent } from './content/post-detail/post-detail.component';


@NgModule({
  declarations: [
    HomeComponent,
    PageNotFoundComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    FlashNewsComponent,
    SidebarComponent,
    PageContentComponent,
    CategoryContentComponent,
    PostDetailComponent
  ],
  imports: [
    CommonModule,
    FrontendRoutingModule
  ]
})
export class FrontendModule { }
