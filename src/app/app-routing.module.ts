// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Guard
import { CanAccessLoggedInArea } from './guards/CanAccessLoggedInArea';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./views/list-tasks/list-tasks.module').then(m => m.ListTasksModule),
    canActivate: [CanAccessLoggedInArea]
  },
  {
    path: 'login',
    loadChildren: () => import('./views/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./views/signup/signup.module').then(m => m.SignupModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
