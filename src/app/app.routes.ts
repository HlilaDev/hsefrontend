import { Routes } from '@angular/router';
import { Layout } from './shared/layout/layout';
import { Home } from './features/pages/home/home';
import { Login } from './features/auth/login/login';
import { guestGuard } from './core/guards/guest/guest-guard';

export const routes: Routes = [
    { path: 'login', component: Login ,
    canActivate: [guestGuard],},
    {
    path: '',
    component: Layout, // Le parent avec Header/Sidebar
    children: [
      { path: 'home', component: Home },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      
  {
  path: 'account',
  loadChildren: () =>
    import('./features/account/account.routes').then(m => m.ACCOUNT_ROUTES),
}
      
    ]
  },
      { path: 'admin', loadChildren: () =>
      import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
];
