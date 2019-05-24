import { NgModule } from '@angular/core';
import { LoadingSpinnerComponent } from './loading-spinner.component';
import { SpinnerService } from './spinner-service';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [
    LoadingSpinnerComponent
  ],
  exports: [
    LoadingSpinnerComponent,
  ],
  providers: [SpinnerService]
})
export class LoadingSpinnerModule {
}
