/**
 * This file should host all custom validators for form fields.
 * The below custom validators should be used when Angular's built-in validators just aren't enough.
 * i.e. - cases that require some cross-field validation
 */

import { ValidatorFn, AbstractControl } from '@angular/forms';

import { PATTERNS } from './form-errors.constant';

export class CustomValidator {
  static atLeastOneNumberRequired(): ValidatorFn | null {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const atLeastOneNumRegex = PATTERNS.atLeastOneNum.pattern;
      const atLeastOneNum = atLeastOneNumRegex.test(control.value);
      return !atLeastOneNum
        ? { pattern: { requiredPattern: atLeastOneNumRegex } }
        : null;
    };
  }
}
