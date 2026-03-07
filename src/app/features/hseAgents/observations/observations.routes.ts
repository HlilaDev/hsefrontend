import { Routes } from '@angular/router';

export const OBSERVATIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./my-observations/my-observations')
        .then(m => m.MyObservations),
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./add-observation/add-observation')
        .then(m => m.AddObservation),
  },

    {
    path: ':id',
    loadComponent: () =>
      import('./observation-details/observation-details')
        .then(m => m.ObservationDetails),
  },
];