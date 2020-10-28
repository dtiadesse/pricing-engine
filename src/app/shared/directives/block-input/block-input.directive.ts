/**
 * This directive should be used to restrict input for any forms input component by specifying a regex pattern for the allowed input.
 */

import { Directive, Input, ElementRef, HostListener } from '@angular/core';
import * as _ from 'lodash';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[mfPeBlockInput]'
})
export class BlockInputDirective {
  @Input('mfPeBlockInput') pattern: string;

  // ------------------------------ Init ------------------------------

  constructor(private element: ElementRef) {}

  // ------------------------------ Host Listeners ------------------------------

  @HostListener('input', ['$event'])
  onInputChange(event) {
    // get the value of the input element within the component
    const inputEl = this.element.nativeElement;
    const initialValue = inputEl.value;
    // set up the regex
    const regex: RegExp = new RegExp(this.pattern, 'g');

    inputEl.value = _.replace(initialValue, regex, '');

    // stop the value from being set if it doesn't match the original value after replacing values that match the regex
    if (initialValue !== inputEl.value) {
      event.stopPropagation();
    }
  }

  // ------------------------------------------------------------
}
