import { Component } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  constructor(public themeService: ThemeService) {}

  get currentTheme() {
    return this.themeService.theme();
  }

  get isDarkMode() {
    return this.currentTheme === 'dark';
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
