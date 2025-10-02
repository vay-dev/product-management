import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Pages } from './pages/pages';
import { Products } from './products/products';
import { GridDemoComponent } from './grid/grid';
import { TodoGridComponent } from './todo-grid/todo-grid';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'pages',
    component: Pages,
  },
  {
    path: 'products',
    component: Products,
  },
  {
    path: 'grid',
    component: GridDemoComponent,
  },
  {
    path: 'todo-grid',
    component: TodoGridComponent,
  },
];
