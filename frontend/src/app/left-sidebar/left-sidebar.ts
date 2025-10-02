import { Categories } from './../categories/categories';
import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-left-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './left-sidebar.html',
  styleUrl: './left-sidebar.scss',
})

// interface LinkItems {
//   routeLink: string;
//   icon: string;
// }
export class LeftSidebar {
  isLeftSidebarCollapsed = input.required<boolean>();

  toggleState = output<boolean>();

  items = [
    { routeLink: '/', icon: 'fa fa-home', label: 'Home' },
    { routeLink: '/products', icon: 'fa fa-cart-shopping', label: 'Products' },
    { routeLink: '/categories', icon: 'fa fa-box-open', label: 'Categories' },
    { routeLink: '/settings', icon: 'fa fa-cog', label: 'Settings' },
  ];

  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
