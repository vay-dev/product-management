import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PageView } from './components/page-view/page-view';
import { FormField } from './components/form-field/form-field';
import { Loader } from './components/loader/loader';
import { SpecialH1 } from './components/special-h1/special-h1';

@NgModule({
  declarations: [
    PageView,
    FormField,
    Loader,
    SpecialH1,
  ],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [
    PageView,
    FormField,
    Loader,
    SpecialH1,
  ],
})
export class SharedModule {}
