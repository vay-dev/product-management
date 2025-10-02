import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

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
    { routeLink: '/pages', icon: 'fa fa-file', label: 'Pages' },
    { routeLink: '/products', icon: 'fa fa-box-open', label: 'Products' },
    { routeLink: '/grid', icon: 'fa fa-box-open', label: 'Grid' },
    { routeLink: '/todo-grid', icon: 'fa fa-box-open', label: 'TodoGrid' },
  ];
}
