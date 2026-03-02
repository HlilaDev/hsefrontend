import { Routes } from '@angular/router';

export const DEVICES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./all-devices/all-devices').then(m => m.AllDevices),
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./add-device/add-device').then(m => m.AddDevice),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./edit-device/edit-device').then(m => m.EditDevice),
  },
];