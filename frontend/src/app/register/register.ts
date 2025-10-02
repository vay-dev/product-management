import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SharedModule } from '../shared/shared-module';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  get passwordsMatch(): boolean {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    return password === confirmPassword;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    if (!this.passwordsMatch) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { username, email, password } = this.registerForm.value;

    this.authService
      .register({
        username,
        email,
        password,
        profile_picture: this.selectedFile || undefined,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          // Auto-login after successful registration
          this.authService.login(username, password).subscribe({
            next: () => {
              this.router.navigate(['/']);
            },
            error: () => {
              // If auto-login fails, redirect to login page
              this.router.navigate(['/login']);
            },
          });
        },
        error: (error) => {
          this.loading = false;
          console.error('Registration error:', error);

          if (error.status === 400) {
            this.errorMessage = error.error?.username?.[0] || error.error?.email?.[0] || 'Invalid registration data';
          } else {
            this.errorMessage = 'An error occurred. Please try again.';
          }
        },
      });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
