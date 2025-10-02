import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { Todo } from '../interfaces/todo.interface';
import { FormsModule } from '@angular/forms';
import { SearchTodosPipe } from '../pipes/filtertodos.pipe';

@Component({
  selector: 'app-todo-grid',
  standalone: true,
  imports: [CommonModule, AgGridAngular, FormsModule, SearchTodosPipe],
  templateUrl: './todo-grid.html',
  styleUrl: './todo-grid.scss',
})
export class TodoGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid!: AgGridAngular;
  searchKey = '';

  todos: Todo[] = [];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  columnDefs: ColDef[] = [
    { field: 'id', width: 90 },
    { field: 'title', flex: 1 },
    {
      field: 'completed',
      headerName: 'Status',
      cellRenderer: this.statusRenderer.bind(this), // custom render function
      width: 150,
    },
  ];

  async ngOnInit() {
    const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=20');
    this.todos = await res.json();
  }

  statusRenderer(params: any) {
    const completed = params.value;
    const eDiv = document.createElement('div');

    // badge element
    const badge = document.createElement('span');
    badge.innerText = completed ? 'Completed' : 'Pending';
    badge.style.padding = '4px 8px';
    badge.style.borderRadius = '12px';
    badge.style.color = 'white';
    badge.style.fontSize = '12px';
    badge.style.cursor = 'pointer';
    badge.style.backgroundColor = completed ? 'green' : 'gray';

    // checkbox toggle
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;
    checkbox.style.marginLeft = '8px';

    checkbox.addEventListener('change', () => {
      params.node.setDataValue('completed', checkbox.checked);
      badge.innerText = checkbox.checked ? 'Completed' : 'Pending';
      badge.style.backgroundColor = checkbox.checked ? 'green' : 'gray';
    });

    eDiv.appendChild(badge);
    eDiv.appendChild(checkbox);
    return eDiv;
  }

  exportAsCsv(): void {
    this.agGrid.api.exportDataAsCsv();
  }

  resizeToFit(): void {
    this.agGrid.api.sizeColumnsToFit();
  }
}
