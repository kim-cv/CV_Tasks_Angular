// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Guard
import { CanAccessLoggedInArea } from './guards/CanAccessLoggedInArea';

const routes: Routes = [
  {
    path: '',
    loadChildren: './views/list-tasks/list-tasks.module#ListTasksModule',
    canActivate: [CanAccessLoggedInArea]
  },
  {
    path: 'login',
    loadChildren: './views/login/login.module#LoginModule'
  },
  {
    path: 'signup',
    loadChildren: './views/signup/signup.module#SignupModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
