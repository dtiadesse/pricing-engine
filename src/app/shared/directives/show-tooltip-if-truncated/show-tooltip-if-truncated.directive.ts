/**
 * This directive is used to hide/show MatTooltip based on whether the text in the element is truncated.
 * i.e. - Only show the tooltip when the user hovers over text with an ellipsis.
 */

import { Directive, ElementRef, HostListener } from '@angular/core';

// Material
import { MatTooltip } from '@angular/material/tooltip';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[matTooltip][mfPeShowTooltipIfTruncated]'
})
export class ShowTooltipIfTruncatedDirective {
  element: HTMLElement;

  constructor(private elRef: ElementRef<HTMLElement>, private matTooltip: MatTooltip) {}

  @HostListener('mouseenter')
  onEnter() {
    this.matTooltip.disabled =
      this.elRef.nativeElement.scrollWidth <= this.elRef.nativeElement.clientWidth;
  }
}
