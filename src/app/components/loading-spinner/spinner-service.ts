import { Injectable } from '@angular/core';
import { LoadingSpinnerComponent } from './loading-spinner.component';


@Injectable()
export class SpinnerService {
  private spinnerCache = new Set<LoadingSpinnerComponent>();

  _register(spinner: LoadingSpinnerComponent): void {
    this.spinnerCache.add(spinner);
  }

  show(spinnerName: string): void {
    this.spinnerCache.forEach(spinner => {
      if (spinner.name === spinnerName) {
        spinner.show = true;
      }
    });
  }

  hide(spinnerName: string): void {
    this.spinnerCache.forEach(spinner => {
      if (spinner.name === spinnerName) {
        spinner.show = false;
      }
    });
  }

  isShown(spinnerName: string): boolean {
    let found: LoadingSpinnerComponent;

    this.spinnerCache.forEach(spinner => {
      if (spinner.name === spinnerName) {
        found = spinner;
      }
    });
    if (found) {
      return found.show;
    } else {
      return false;
    }
  }
}
