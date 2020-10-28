/**
 * This service should be used soley as a utility service for performing actions on/against Forms classes (FormGroups, FormControls, etc.)
 */

import { Injectable, Inject } from '@angular/core';
import {
  AbstractControl,
  Validators,
  ValidatorFn,
  FormGroup,
  FormArray,
  FormControl
} from '@angular/forms';
import * as _ from 'lodash';

// Data
import { FORM_ERRORS } from '../utility/form-errors.constant';

@Injectable({
  providedIn: 'root'
})
export class FormHelperService {
  constructor(@Inject(FORM_ERRORS) private errors) {}

  // ------------------------------ Handle Validators ------------------------------

  // This will take care of setting/resetting the given validator for each given control
  setValidators(
    rootControl: AbstractControl,
    validator?: string | ValidatorFn,
    validatorParam?: any
  ): void {
    if (rootControl instanceof FormGroup || rootControl instanceof FormArray) {
      const controls = rootControl.controls;
      _.forEach(_.keys(controls), (control: string[]) => {
        this.setValidators(rootControl.get(control), validator, validatorParam);
      });
    }
    if (rootControl instanceof FormControl) {
      if (validator) {
        const validatorRef: any =
          typeof validator === 'string'
            ? Validators[validator](validatorParam || rootControl)
            : validator;
        rootControl.setValidators(validatorRef);
      } else {
        rootControl.clearValidators();
      }
      rootControl.updateValueAndValidity();
    }
  }

  // ------------------------------------------------------------

  getErrorMessage(control: AbstractControl) {
    const controlErrors = control.errors;
    let text = '';

    if (controlErrors) {
      // get the first error
      const firstKey = _.keys(controlErrors)[0];
      const firstVal = _.values(controlErrors)[0];

      // set the error function
      const getError = this.errors[firstKey];
      // set the param according to the type of error found
      const param =
        typeof firstVal === 'object' ? firstVal : controlErrors[firstKey];
      // call the error function to get the correct error text to display
      // show the default error message in order to ensure devs are maintaining validations properly
      text = !getError ? '' : getError(param);
    }

    return text;
  }
}
