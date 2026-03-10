import { Routes } from '@angular/router';
import { ZonesOverview } from '../../shared/zones/zones-overview/zones-overview';
import { ZoneDetails } from '../../shared/zones/zone-details/zone-details';
import { LiveStream } from '../../shared/live-stream/live-stream';
import { IncidentsOverview } from '../../shared/incidents/incidents-overview/incidents-overview';
import { IncidentDetails } from '../../shared/incidents/incident-details/incident-details';
import { NotificationsList } from '../../shared/notifications/notifications-list/notifications-list';

export const HSEMANAGERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/hsemanager-layout/hsemanager-layout')
        .then(m => m.HsemanagerLayout), // ✅ shell with <router-outlet>
    children: [
      // ✅ /manager → dashboard
      {
        path: '',
        loadComponent: () =>
          import('./hsemanager-dashboard/hsemanager-dashboard')
            .then(m => m.HsemanagerDashboard),
      },
        //zone overview
          { path: 'zones', component:ZonesOverview
        },

        //zone details
          { path: 'zones/:id', component:ZoneDetails
        },

                //zone details
          { path: 'notifications', component:NotificationsList
        },

                //live
          { path: 'live', component:LiveStream
        },
                //incidents
          { path: 'incidents', component:IncidentsOverview
        },
                        //incidents
          { path: 'incidents/detail', component:IncidentDetails
        },
      // ✅ /manager/trainings
      {
        path: 'trainings',
        loadChildren: () =>
          import('./trainings/trainings.routes')
            .then(m => m.TRAININGS_ROUTES),
      },

            // ✅ /manager/audits
      {
        path: 'audits',
        loadChildren: () =>
          import('./audits/audits.routes')
            .then(m => m.MONITORING_ROUTES),
      },

            // ✅ /manager/reports
      {
        path: 'reports',
        loadChildren: () =>
          import('./reports/reports.routes')
            .then(m => m.REPORTS_ROUTES),
      },
    // ✅ /manager/monitoring
      {
        path: 'monitoring',
        loadChildren: () =>
          import('./monitoring/monitoring.routes')
            .then(m => m.MONITORING_ROUTES),
      },
     
      { path: '', redirectTo: '', pathMatch: 'full' },
    ],
  },
];