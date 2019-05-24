import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListTasksRoutingModule } from './list-tasks-routing.module';
import { ListTasksComponent } from './list-tasks.component';
import { StringShorterModule } from 'src/app/pipes/string-shorter/string-shorter.module';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BtnLaddaModule } from 'src/app/components/btn-ladda/btn-ladda.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../../components/loading-spinner/loading-spinner.module';

@NgModule({
  declarations: [ ListTasksComponent ],
  imports: [
    CommonModule,
    ListTasksRoutingModule,
    StringShorterModule,
    BsDropdownModule.forRoot(),
    FontAwesomeModule,
    BtnLaddaModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingSpinnerModule
  ]
})
export class ListTasksModule { }
