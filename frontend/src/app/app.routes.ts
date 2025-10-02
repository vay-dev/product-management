import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Products } from './products/products';
import { Categories } from './categories/categories';
import { Settings } from './settings/settings';
import { Login } from './login/login';
import { Register } from './register/register';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: '',
    component: Home,
    canActivate: [authGuard],
  },
  {
    path: 'products',
    component: Products,
    canActivate: [authGuard],
  },
  {
    path: 'categories',
    component: Categories,
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    component: Settings,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
