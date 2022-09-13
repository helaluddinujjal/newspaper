import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryContentComponent } from './content/category-content/category-content.component';
import { HomeComponent } from './content/home/home.component';
import { PageContentComponent } from './content/page-content/page-content.component';
import { PageNotFoundComponent } from './content/page-not-found/page-not-found.component';
import { PostDetailComponent } from './content/post-detail/post-detail.component';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component:LayoutComponent,
    children: [
      { path: '', redirectTo:'home',pathMatch: 'full' },
      {
        path: 'home',
        component: HomeComponent
      },

      {
        path: 'page',
        children: [
          { path: ':slug', component:PageContentComponent },
        ]
      },
      {
        path: ':category',
        component:CategoryContentComponent
      },
      {
        path: ':category/:tag/:post',
        component:PostDetailComponent
      },
      {
        path: '**',
        component: PageNotFoundComponent
      },
    ]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontendRoutingModule { }
