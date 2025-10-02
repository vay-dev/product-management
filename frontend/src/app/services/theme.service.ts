import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';

  theme = signal<Theme>(this.getStoredTheme());

  constructor() {
    // Apply theme on initialization
    this.applyTheme(this.theme());

    // Watch for theme changes and apply them
    effect(() => {
      const currentTheme = this.theme();
      this.applyTheme(currentTheme);
      localStorage.setItem(this.THEME_KEY, currentTheme);
    });
  }

  toggleTheme(): void {
    this.theme.update(current => current === 'light' ? 'dark' : 'light');
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  private getStoredTheme(): Theme {
    const stored = localStorage.getItem(this.THEME_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
