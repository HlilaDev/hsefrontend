import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

type ZoneStatus = 'active' | 'inactive' | 'warning';
type ZoneRisk = 'low' | 'medium' | 'high';

type ZoneCard = {
  _id: string;
  name: string;
  code?: string;
  description?: string;
  status: ZoneStatus;
  riskLevel: ZoneRisk;
  employeesCount: number;
  devicesCount: number;
  sensorsCount: number;
  alertsCount: number;
  temperature?: number | null;
  humidity?: number | null;
};

@Component({
  selector: 'app-zones-overview',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './zones-overview.html',
  styleUrl: './zones-overview.scss',
})
export class ZonesOverview {
  loading = signal(false);
  error = signal<string | null>(null);

  search = signal('');
  statusFilter = signal('');
  riskFilter = signal('');

  zones = signal<ZoneCard[]>([
    {
      _id: 'z1',
      name: 'Production A',
      code: 'PR-A',
      description: 'Main production workshop area.',
      status: 'active',
      riskLevel: 'high',
      employeesCount: 18,
      devicesCount: 4,
      sensorsCount: 12,
      alertsCount: 2,
      temperature: 34,
      humidity: 58,
    },
    {
      _id: 'z2',
      name: 'Warehouse',
      code: 'WH-01',
      description: 'Storage and logistics zone.',
      status: 'warning',
      riskLevel: 'medium',
      employeesCount: 9,
      devicesCount: 3,
      sensorsCount: 8,
      alertsCount: 1,
      temperature: 29,
      humidity: 49,
    },
    {
      _id: 'z3',
      name: 'Maintenance',
      code: 'MT-02',
      description: 'Technical maintenance workspace.',
      status: 'inactive',
      riskLevel: 'low',
      employeesCount: 5,
      devicesCount: 2,
      sensorsCount: 5,
      alertsCount: 0,
      temperature: 26,
      humidity: 44,
    },
    {
      _id: 'z4',
      name: 'Chemical Storage',
      code: 'CH-09',
      description: 'Controlled hazardous materials area.',
      status: 'active',
      riskLevel: 'high',
      employeesCount: 4,
      devicesCount: 5,
      sensorsCount: 14,
      alertsCount: 3,
      temperature: 22,
      humidity: 41,
    },
  ]);

  filteredZones = computed(() => {
    const q = this.search().trim().toLowerCase();
    const status = this.statusFilter().trim().toLowerCase();
    const risk = this.riskFilter().trim().toLowerCase();

    return this.zones().filter((z) => {
      const matchSearch =
        !q ||
        z.name.toLowerCase().includes(q) ||
        (z.code ?? '').toLowerCase().includes(q) ||
        (z.description ?? '').toLowerCase().includes(q);

      const matchStatus = !status || z.status.toLowerCase() === status;
      const matchRisk = !risk || z.riskLevel.toLowerCase() === risk;

      return matchSearch && matchStatus && matchRisk;
    });
  });

  totalZones = computed(() => this.zones().length);
  activeZones = computed(
    () => this.zones().filter((z) => z.status === 'active').length
  );
  warningZones = computed(
    () => this.zones().filter((z) => z.status === 'warning').length
  );
  totalAlerts = computed(() =>
    this.zones().reduce((sum, z) => sum + z.alertsCount, 0)
  );

  clearFilters() {
    this.search.set('');
    this.statusFilter.set('');
    this.riskFilter.set('');
  }

  trackByZone = (_: number, zone: ZoneCard) => zone._id;

  statusKey(status: ZoneStatus): string {
    return `ZONES.OVERVIEW.STATUS.${status}`;
  }

  riskKey(risk: ZoneRisk): string {
    return `ZONES.OVERVIEW.RISK.${risk}`;
  }

  statusClass(status: ZoneStatus): string {
    if (status === 'active') return 'ok';
    if (status === 'warning') return 'warn';
    return 'bad';
  }

  riskClass(risk: ZoneRisk): string {
    if (risk === 'low') return 'ok';
    if (risk === 'medium') return 'warn';
    return 'bad';
  }

  value(v: string | number | null | undefined): string {
    return v === null || v === undefined || v === '' ? '—' : String(v);
  }
}