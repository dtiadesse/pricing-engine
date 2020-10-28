import { Injectable } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';
import * as _ from 'lodash';

/**
 * This service should be used strictly for setting up forms and adding/updating any FormArrays, FormGroups, or FormControls
 */

@Injectable({
  providedIn: 'root'
})
export class FormService {
  // ------------------------------ Init ------------------------------

  constructor(private fb: FormBuilder) {}

  // ------------------------------ Form Setup ------------------------------

  /**
   * This will take care of setting up the given FormGroup structure based on the given JSON model object.
   * @param model : this is the JSON object defined by the backend
   *  - i.e. - model = {  reason: '', editableFields: [ {...}, ..., {...} ] }
   * @param group : the FormGroup that needs to be set up / updated
   */
  setUpForm(model: object, group: FormGroup) {
    const keys = _.keys(model);
    _.forEach(keys, key => {
      if (model[key] instanceof Array) {
        this.setUpFormArray(group, model[key], key);
        return;
      }

      if (model[key] instanceof Object) {
        this.setUpFormGroup(group, model[key], key);
        return;
      }

      this.setUpFormControl(group, model[key], key);
    });
  }

  /**
   * This will take care of setting up the FormArray for the given JSON model property in the given group.
   * REMINDER: A best practice when creating forms is to avoid creating largely-nested forms (i.e. - a FormGroup
   * with a FormArray of FormArrays). Always break large groups into smaller, more manageable ones.
   * @param group : the FormGroup that is being set up and needs the added/replaced FormArray
   * @param values : the array of values for the given JSON model property
   * @param key : the key of the given JSON model property
   */
  private setUpFormArray(group: FormGroup, values: any[], key: string) {
    if (_.isEmpty(values)) {
      return;
    }

    // if values in the array are simple strings or more arrays, then just handle this as a simple FormControl
    if (!(values[0] instanceof Object) || values[0] instanceof Array) {
      this.setUpFormControl(group, values, key);
      return;
    }

    // if the control doesn't currently exist in the FormGroup, then add it as a new FormArray, OR replace it
    if (!group.contains(key)) {
      group.addControl(key, this.fb.array([]));
    } else {
      group.setControl(key, this.fb.array([]));
    }

    // by this time, we know that we have an array of objects, so create an array of FormGroups
    const array = group.get(key) as FormArray;
    _.forEach(values, obj => {
      const newArrayGroup = this.fb.group({});

      this.setUpForm(obj, newArrayGroup);
      array.push(newArrayGroup);
    });
  }

  /**
   * This will take care of setting up the FormGroup for the given property in the given FormGroup.
   * @param group : the FormGroup that is being set up and needs the added/replaced FormGroup
   * @param values : the array of values for the given property
   * @param key : the key of the given property
   */
  private setUpFormGroup(group: FormGroup, values: any, key: string) {
    // if the control doesn't currently exist in the FormGroup, then add it as a new FormGroup, OR replace it
    if (!group.contains(key)) {
      group.addControl(key, this.fb.group({}));
    } else {
      group.setControl(key, this.fb.group({}));
    }

    const newGroup = group.get(key) as FormGroup;
    this.setUpForm(values, newGroup);
  }

  /**
   * This will take care of setting up the FormControl and patching the value for the given property in the given FormGroup.
   * @param group : the FormGroup that is being set up and needs the added/replaced FormControl
   * @param value : the value for the given property
   * @param key : the key of the given property
   */
  private setUpFormControl(group: FormGroup, value: any, key: string) {
    if (!group.contains(key)) {
      group.addControl(key, this.fb.control(''));
    } else {
      group.setControl(key, this.fb.control(''));
    }

    const control = group.get(key) as FormControl;
    control.patchValue(value);
  }

  // ------------------------------------------------------------
}
