/*
 * This custom Pipe should take any array and, if valid, transform it into a string
 * consisting of the values, delimited by a ", ".
 *
 * Usage:
 *  array | displayCommaDelimitedValues
 *
 * Examples:
 * {{ [1, 2, 3, 4, 5] | displayPositiveNegative }}
 *  outputs: '1, 2, 3, 4, 5'
 */

import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "displayCommaDelimitedValues",
})
export class DisplayCommaDelimitedValuesPipe implements PipeTransform {
  transform(values: any[]): string | any[] {
    return !!values ? values.join(", ") : values;
  }
}
