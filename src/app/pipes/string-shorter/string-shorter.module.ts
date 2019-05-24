import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StringShorterPipe } from './string-shorter.pipe';

@NgModule({
  declarations: [StringShorterPipe],
  imports: [
    CommonModule
  ],
  exports: [StringShorterPipe]
})
export class StringShorterModule {
}
