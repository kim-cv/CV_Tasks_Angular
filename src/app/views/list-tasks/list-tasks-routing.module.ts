import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListTasksComponent } from './list-tasks.component';

const routes: Routes = [
  {
    path: '',
    component: ListTasksComponent,
    data: {
      title: 'List Tasks'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListTasksRoutingModule { }
