import { Routes } from '@angular/router';
import { ZonesOverview } from '../../shared/zones/zones-overview/zones-overview';

export const HSEAGENTS_ROUTES: Routes = [

      {
    path: '',
    loadComponent: () =>
      import('./hseagent-dashboard/hseagent-dashboard')
        .then(m => m.HseagentDashboard),
  },

  { path: 'observations',
    loadChildren: () =>
      import('./observations/observations.routes')
        .then(m => m.OBSERVATIONS_ROUTES),
  },

    { path: 'zones', component:ZonesOverview
  },

  
 
  
];