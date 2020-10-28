/**
 * This directive is used to hide/show MatTooltip based on the acceptable width of an element.
 * i.e. - Only show the tooltip when the user hovers over text with an ellipsis.
 */

import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[mfPeIsTooltipDisabled]',
  exportAs: 'tooltipDisabled'
})
export class IsTooltipDisabledDirective {
  @Input('mfPeIsTooltipDisabled') tooltipDisabled = false;
  @Input() tooltipWidthLimit: number;

  constructor(private elRef: ElementRef) {}

  // On hover, check the max width to determine whether or not to show the MatTooltip
  @HostListener('mouseenter')
  onEnter() {
    const currentElWidth = this.elRef.nativeElement.offsetWidth;
    this.tooltipDisabled = currentElWidth <= this.tooltipWidthLimit;
  }
}
