import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('../app/admin/admin.module').then(x => x.AdminModule)
  },
  {
    path: '',
    loadChildren: () => import('./frontend/frontend.module').then(x => x.FrontendModule)
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
