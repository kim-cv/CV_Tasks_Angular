import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * @description Prevents formcontrol from only containing whitespaces
 */
export function validator_preventOnlySpaces(requiredLengthWithoutSpaces: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value;

      if (typeof value === 'undefined' || value === null) {
        return { 'required': { value: value } };
      }

      // Trim both ends
      const trimmedString = value.trim();

      if (trimmedString.length < requiredLengthWithoutSpaces) {
        return { 'minlength': { value: value } };
      }

      return null;
    };
  }