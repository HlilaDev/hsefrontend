import { Routes } from '@angular/router';
import { Layout } from './shared/layout/layout';
import { Home } from './features/pages/home/home';
import { Login } from './features/pages/auth/login/login';

export const routes: Routes = [
    { path: 'login', component: Login },
    {
    path: '',
    component: Layout, // Le parent avec Header/Sidebar
    children: [
      { path: 'home', component: Home },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      
    ]
  },
];
