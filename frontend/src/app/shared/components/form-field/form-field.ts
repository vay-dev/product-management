import { Component, forwardRef, input, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

interface SelectField {
  value: string;
  id: number | string;
}
@Component({
  selector: 'app-form-field',
  imports: [],
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormField),
      multi: true,
    },
  ],
})
export class FormField {
  type = input<'select' | 'checkbox' | 'input' | 'text-area' | 'password'>('input');
  placeholder = input<string>('');
  label = input<string>('default label');
  options = input<Array<SelectField>>();
  isPasswordVisible = signal<boolean>(false);

  innerValue = '';

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.innerValue = value ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // optional but good practice
  }

  // update value and notify Angular
  updateValue(val: any) {
    this.innerValue = val;
    this.onChange(val); // notify Angular forms
    this.onTouched(); // mark as touched
  }
}
