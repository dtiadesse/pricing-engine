/*
 * This custom Pipe should take any string or number value and, if valid, transform it into a string
 * prefixed with a "+" or "-", denoting positive or negative respectfully.
 *
 * Usage:
 *  value | displayPositiveNegative
 *
 * Examples:
 *  {{ (null / undefined / '') | displayPositiveNegative }}
 *  outputs:
 *
 * {{ 'abc' | displayPositiveNegative }}
 *  outputs:
 *
 * {{ -3 | displayPositiveNegative }}
 *  outputs: -3
 *
 * {{ 4 | displayPositiveNegative }}
 *  outputs: +4
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayPositiveNegative'
})
export class DisplayPositiveNegativePipe implements PipeTransform {
  transform(value: number | string): string {
    const numValue: number = +value;

    // if value is any of [null, undefined, '', NaN, 0], then immediately return null to display nothing
    if (isNaN(numValue) || numValue === 0) return null;

    return numValue > 0 ? `+${numValue}` : numValue.toString();
  }
}
