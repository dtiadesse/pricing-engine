/**
 * This file should host all applicable errors for form fields.
 */

import { InjectionToken } from '@angular/core';
import * as _ from 'lodash';

export interface FormErrorPatterns {
  pattern: RegExp;
  message: string;
}

export const PATTERNS: { [key: string]: FormErrorPatterns } = {
  atLeastOneNum: {
    pattern: new RegExp('^[-0-9]+$'),
    message: 'At least one positive or negative number is required'
  }
};

export const defaultErrors: { [key: string]: (key: any) => string } = {
  required: () => 'You must enter a value',
  pattern: obj => {
    const found = _.find(PATTERNS, patternObj => {
      return patternObj.pattern === obj.requiredPattern;
    });
    return found.message;
  }
};

export const FORM_ERRORS = new InjectionToken('FORM_ERRORS', {
  providedIn: 'root',
  factory: () => defaultErrors
});
