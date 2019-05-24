import { Component, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as Ladda from 'ladda';

export enum BtnStates {
  primary,
  secondary,
  success,
  danger,
  warning,
  disabled
}

@Component({
  selector: 'app-btn-ladda',
  templateUrl: './btn-ladda.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None // Cannot remove this because the Ladda JS is adding DOM elements. Angular doesnt adds it own shadow dom tags to it.
})

export class BtnLaddaComponent {
  @ViewChild('btnLadda') set content(content: ElementRef) {
    if (typeof content !== 'undefined' && content !== null) {
      this.btnLadda = Ladda.create(content.nativeElement);
    }
  }

  @Input() text: string;
  @Input() icon: string;
  @Input() cssClasses: string[] = ['btn-primary', 'btn-secondary', 'btn-success', 'btn-danger', 'btn-warning', 'btn-disabled'];

  @Input('size')
  set size(value: string) {
    switch (value) {
      case 'lg':
        this.btnClasses.push('btn-lg');
        break;
      case 'md':
        this.btnClasses.push('btn-md');
        break;
      case 'sm':
        this.btnClasses.push('btn-sm');
        break;

      default:
        console.error('Input size got unknown value', value);
        this.btnClasses.push('btn-md');
        break;
    }
  }

  @Input('initialState')
  set initialState(value: string) {
    // Convert string to Enum type
    const valueAsEnum: BtnStates = BtnStates[value];
    this.SetState(valueAsEnum);
  }

  @Input('isBlock')
  set isBlock(value: boolean) {
    if (value) {
      this.btnClasses.push('btn-block');
    }
  }

  @Input() isSubmit = false;

  public btnLadda: any;
  public BtnStates = BtnStates;
  private btnState: BtnStates;
  public btnClasses = [];

  constructor() { }

  /**
   * @description Sets an immediate state and another state after a number of milliseconds
   * @param duration milliseconds
   */
  public SetStateBeforeAndAfterWithDuration(nowState: BtnStates, afterState: BtnStates, duration: number) {
    this.SetState(nowState);
    setTimeout(() => {
      this.SetState(afterState);
    }, duration);
  }

  /**
   * @description Set button state and apply proper css class
   */
  public SetState(state: BtnStates) {
    const currentCss = this.GetMatchinCssClassOnState(this.btnState);
    const newCss = this.GetMatchinCssClassOnState(state);

    if (typeof currentCss !== 'undefined') {
      this.RemoveCss(currentCss);
    }

    if (typeof newCss !== 'undefined') {
      this.AddCssClassOnStateChange(newCss);
    }

    this.btnState = state;
  }

  public GetState(): BtnStates {
    return this.btnState;
  }

  /**
   * @description Start the loading icon
   */
  public Start() {
    this.btnLadda.start();
  }

  /**
   * @description Stop the loading icon
   */
  public Stop() {
    this.btnLadda.stop();
  }

  /**
   * @description Add css class
   */
  private AddCssClassOnStateChange(cssClass: string): void {
    this.btnClasses.push(cssClass);
  }

  /**
   * @description Remove cass class
   */
  private RemoveCss(cssClass: string): void {
    this.btnClasses = this.btnClasses.filter(tmpClass => tmpClass !== cssClass);
  }

  /**
   * @description Convert button state to css class
   */
  private GetMatchinCssClassOnState(state: BtnStates): string | undefined {
    switch (state) {
      case BtnStates.primary:
        return this.cssClasses[0];
      case BtnStates.secondary:
        return this.cssClasses[1];
      case BtnStates.success:
        return this.cssClasses[2];
      case BtnStates.danger:
        return this.cssClasses[3];
      case BtnStates.warning:
        return this.cssClasses[4];
      case BtnStates.disabled:
        return this.cssClasses[5];

      default:
        return undefined;
    }
  }
}
