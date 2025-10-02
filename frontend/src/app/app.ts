import { Component, effect, HostListener, signal } from '@angular/core';
import { LeftSidebar } from './left-sidebar/left-sidebar';
import { Main } from './main/main';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormField } from './shared/components/form-field/form-field';

@Component({
  selector: 'app-root',
  imports: [LeftSidebar, Main, ReactiveFormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  counter = signal(0);
  form: FormGroup;

  // Increment function
  increment() {
    this.counter.set(this.counter() + 1);
  }

  // Decrement function
  decrement() {
    this.counter.set(this.counter() - 1);
  }

  // Optional: log every time counter changes
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (!this.form.valid) {
      console.log('form is not valid');
      return;
    }

    console.log(this.form.getRawValue());
    this.form.reset();
  }

  protected readonly title = signal('sidebar-refreshing');
  screenInnerWidth = signal<number>(window.innerWidth);

  isLeftSidebarCollapsed = signal<boolean>(false);

  acceptState(state: boolean): void {
    this.isLeftSidebarCollapsed.set(state);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.screenInnerWidth.set(window.innerWidth);
    this.isLeftSidebarCollapsed.set(this.screenInnerWidth() < 730);
  }
}
