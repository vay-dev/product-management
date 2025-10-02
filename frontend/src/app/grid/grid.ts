// src/app/grid-demo/grid-demo.component.ts
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef } from 'ag-grid-community';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grid-demo',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  templateUrl: './grid.html',
  styleUrl: './grid.scss',
})
export class GridDemoComponent implements AfterViewInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;

  columnDefs: ColDef[] = [
    { field: 'make', headerName: 'Make' },
    { field: 'model', headerName: 'Model' },
    { field: 'price', headerName: 'Price' },
    { field: 'electric', headerName: 'Electric' },
  ];

  defaultColDef = {
    sortable: true,
    filter: false,
    resizable: true,
  };

  rowData = [
    { make: 'Toyota', model: 'Corolla', price: 20000, electric: false },
    { make: 'Tesla', model: 'Model 3', price: 48000, electric: true },
    { make: 'Ford', model: 'F-150', price: 35000, electric: false },
  ];

  ngAfterViewInit(): void {
    // optional: call grid API after view init
    this.agGrid.api.sizeColumnsToFit();
  }

  exportCsv() {
    // uses Grid API to export current view as CSV
    this.agGrid.api.exportDataAsCsv();
  }

  fitCols() {
    this.agGrid.api.sizeColumnsToFit();
  }
}
