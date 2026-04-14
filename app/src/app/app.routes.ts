import { Routes } from '@angular/router';
import { Cadastro } from './components/pages/cadastro/cadastro';
import { Login } from './components/pages/login/login';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'cadastro',
    component: Cadastro,
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
