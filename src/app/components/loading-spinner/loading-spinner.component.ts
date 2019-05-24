import { Component, Input, OnInit } from '@angular/core';

import { SpinnerService } from './spinner-service';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: 'loading-spinner.component.html',
  styleUrls: [
    './loading-spinner.component.scss'
  ]
})
export class LoadingSpinnerComponent implements OnInit {
  @Input() name: string;
  @Input() show: boolean;

  constructor(private spinnerService: SpinnerService) {
  }

  ngOnInit(): void {
    if (typeof this.name === 'undefined' || this.name === null) { throw new Error('Spinner must have a \'name\' attribute.'); }
    if (typeof this.show === 'undefined' || this.show === null) { throw new Error('Spinner must have a \'show\' attribute.'); }
    this.spinnerService._register(this);
  }
}
