import { Routes } from '@angular/router';

export const INSPECTIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./inspections-overview/inspections-overview')
        .then(m => m.InspectionsOverview),
  },
    {
    path: 'templates/new',
    loadComponent: () =>
      import('./templates/create-template/create-template')
        .then(m => m.CreateTemplate),
  },
      {
    path: 'templates',
    loadComponent: () =>
      import('./templates/templates-list/templates-list')
        .then(m => m.TemplatesList),
  },
        {
    path: 'templates/:id',
    loadComponent: () =>
      import('./templates/template-item/template-item')
        .then(m => m.TemplateItem),
  },
];