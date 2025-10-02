import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: number;
  username: string;
  email: string;
  profile_picture?: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  profile_picture?: File;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8000/api';

  // Signal for reactive authentication state
  isAuthenticated = signal<boolean>(this.hasToken());
  currentUser = signal<User | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Load user from storage on init
    this.loadUserFromStorage();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('current_user');
    if (userStr) {
      try {
        this.currentUser.set(JSON.parse(userStr));
      } catch (e) {
        console.error('Error parsing user from storage', e);
      }
    }
  }

  register(data: RegisterData): Observable<User> {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('password', data.password);
    if (data.profile_picture) {
      formData.append('profile_picture', data.profile_picture);
    }

    return this.http.post<User>(`${this.baseUrl}/register/`, formData);
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/login/`, {
        username,
        password,
      })
      .pipe(
        tap((response) => {
          // Store tokens
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);

          // Update authentication state
          this.isAuthenticated.set(true);

          // Decode and store user info from JWT (basic implementation)
          this.decodeAndStoreUser(response.access);
        })
      );
  }

  private decodeAndStoreUser(token: string): void {
    try {
      // Basic JWT decode (payload is between first and second dot)
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));

      // Store user info (JWT contains user_id, username, etc.)
      const user: User = {
        id: decodedPayload.user_id,
        username: decodedPayload.username || '',
        email: decodedPayload.email || '',
      };

      this.currentUser.set(user);
      localStorage.setItem('current_user', JSON.stringify(user));
    } catch (e) {
      console.error('Error decoding token', e);
    }
  }

  logout(): void {
    // Clear tokens and user data
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_user');

    // Update state
    this.isAuthenticated.set(false);
    this.currentUser.set(null);

    // Redirect to login
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<{ access: string }> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http
      .post<{ access: string }>(`${this.baseUrl}/token/refresh/`, {
        refresh: refreshToken,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('access_token', response.access);
        })
      );
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }
}
