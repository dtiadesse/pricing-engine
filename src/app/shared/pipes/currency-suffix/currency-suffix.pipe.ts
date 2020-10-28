/*
 * This custom Pipe should take any string and, if valid, transform it into a string
 *
 * Usage:
 *  value | currencySuffix
 *
 * Examples:
 * {{48210000 | currencySuffix }}
 *  outputs: '$48M'
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'currencySuffix'
})
export class CurrencySuffixPipe implements PipeTransform {
    transform(input: any, args?: any): any {
        let exp;
        const suffixes = ['K', 'M', 'G', 'T', 'P', 'E'];


        if (Number.isNaN(input) || !input) {
            return null;
        }

        if (input < 1000) {
            return `$${input}`;
        }
        if (input) {
            exp = Math.floor(Math.log(input) / Math.log(1000));
        }
        const value = (input / Math.pow(1000, exp)).toFixed(args) + suffixes[exp - 1];
        return exp === null ? null : `$${value}`;
    }
}
