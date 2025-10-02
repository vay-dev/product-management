import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {
  sidebarState = input.required<boolean>();
}
