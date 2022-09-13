import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuardService } from './auth/services/auth-guard.service';
import { LoginGuardService } from './auth/services/login-guard.service';
import { CategoryCreateComponent } from './page-content/category/category-create/category-create.component';
import { CategoryListComponent } from './page-content/category/category-list/category-list.component';
import { DashboardComponent } from './page-content/dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [

  { path: 'login', component:LoginComponent,canActivate:[LoginGuardService] },
  {
    path: '',
    component: AdminMainComponent,
    children: [
      { path: '', redirectTo:'dashboard',pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent, canActivate:[AuthGuardService]
      },

      {
        path: 'category',
        loadChildren: () => import('../admin/page-content/category/category.module').then(x => x.CategoryModule), canActivate:[AuthGuardService]
      },

      {
        path: 'tag',
        loadChildren: () => import('../admin/page-content/tags/tags.module').then(x => x.TagsModule), canActivate:[AuthGuardService]
      },

      {
        path: 'post',
        loadChildren: () => import('../admin/page-content/posts/posts.module').then(x => x.PostsModule), canActivate:[AuthGuardService]
      },
      {
        path: 'page',
        loadChildren: () => import('../admin/page-content/dynamic-page/dynamic-page.module').then(x => x.DynamicPageModule), canActivate:[AuthGuardService]
      },
      {
        path: 'activity-log',
        loadChildren: () => import('../admin/page-content/activity-log/activity-log.module').then(x => x.ActivityLogModule), canActivate:[AuthGuardService]
      },
      {
        path: 'settings',
        loadChildren: () => import('../admin/page-content/settings/settings.module').then(x => x.SettingsModule), canActivate:[AuthGuardService]
      },
      { path: '**', component: PageNotFoundComponent },
     // { path: '', redirectTo: 'admin/dashboard', pathMatch: 'full' },
    ]

  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
