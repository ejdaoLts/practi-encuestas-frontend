import { Validators } from '@angular/forms';

export const required = Validators.required;

export const onlyNumber = Validators.pattern(/^[0-9]+$/);

export const email = Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$/);

export const maxLength = (maxLength: number) => {
  return Validators.maxLength(maxLength);
};

export const minLength = (minLength: number) => {
  return Validators.minLength(minLength);
};

export const max = (max: number) => {
  return Validators.max(max);
};

export const min = (min: number) => {
  return Validators.min(min);
};
