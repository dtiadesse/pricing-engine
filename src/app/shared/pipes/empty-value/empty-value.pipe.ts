/*
 * This custom Pipe should take any value, and if empty, transform it to the UX standard of "&ndash;" (displays as "-").
 * It takes an optional string argument for disabling this transformation for values of "0".
 *
 * Usage:
 *  value | emptyValue
 *
 * Examples:
 *  {{ (null / undefined) | emptyValue }}
 *  outputs: "-"
 *
 *  {{ '' | emptyValue }}
 *  outputs: "-"
 *
 * {{ 'abc' | emptyValue }}
 *  outputs: 'abc'
 *
 * {{ 0 | emptyValue }}
 *  outputs: "-"
 *
 *  {{ 0 | emptyValue:'0' }}
 *  outputs: 0
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'emptyValue' })
export class EmptyValuePipe implements PipeTransform {
  transform(value: any, displayVal?: string): any {
    const isEmpty: boolean = value == null || value === '';
    // check for a value of zero and if displayVal is set to '0'
    const dispZero: boolean = !isEmpty && displayVal === '0' && +value === 0;

    // create a temporary html element for (possibly and) properly setting the value to a HTML unicode character
    const tempElement = document.createElement('div');
    tempElement.innerHTML = dispZero || !isEmpty ? value : '&ndash;';

    return tempElement.innerText;
  }
}
