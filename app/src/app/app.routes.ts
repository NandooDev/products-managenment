import { Routes } from '@angular/router';
import { Cadastro } from './components/pages/cadastro/cadastro';
import { Home } from './components/pages/home/home';
import { Login } from './components/pages/login/login';
import { Usuarios } from './components/pages/usuarios/usuarios';

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
    path: 'home',
    component: Home,
  },
  {
    path: 'usuarios',
    component: Usuarios,
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
