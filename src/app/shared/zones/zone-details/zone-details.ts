import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

type ZoneDevice = {
  _id: string;
  name: string;
  deviceId: string;
  status: 'online' | 'offline' | 'maintenance';
};

type ZoneSensor = {
  _id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'maintenance';
};

type ZoneEmployee = {
  _id: string;
  fullName: string;
  department?: string;
  jobTitle?: string;
  isActive?: boolean;
};

type ZoneModel = {
  _id: string;
  name: string;
  description?: string;
  riskLevel: 'low' | 'medium' | 'high';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  temperature?: number | null;
  humidity?: number | null;
  alertsCount?: number;
  devices?: ZoneDevice[];
  sensors?: ZoneSensor[];
  employees?: ZoneEmployee[];
};

@Component({
  selector: 'app-zone-details',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './zone-details.html',
  styleUrl: './zone-details.scss',
})
export class ZoneDetails {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly zone = signal<ZoneModel | null>({
    _id: 'zone-1',
    name: 'Production A',
    description: 'Main production area with active monitoring devices and safety sensors.',
    riskLevel: 'high',
    isActive: true,
    createdAt: '2026-03-01T08:20:00.000Z',
    updatedAt: '2026-03-07T09:10:00.000Z',
    temperature: 31,
    humidity: 54,
    alertsCount: 2,
    devices: [
      { _id: 'd1', name: 'ESP Gate A', deviceId: 'esp8266-01', status: 'online' },
      { _id: 'd2', name: 'Raspberry Main', deviceId: 'rasp-01', status: 'maintenance' }
    ],
    sensors: [
      { _id: 's1', name: 'Temp Sensor A1', type: 'temperature', status: 'online' },
      { _id: 's2', name: 'Gas Sensor A2', type: 'gas', status: 'online' },
      { _id: 's3', name: 'Humidity Sensor A3', type: 'humidity', status: 'offline' }
    ],
    employees: [
      { _id: 'e1', fullName: 'Ahmed Ben Ali', department: 'Production', jobTitle: 'Technician', isActive: true },
      { _id: 'e2', fullName: 'Sarra Trabelsi', department: 'Safety', jobTitle: 'HSE Agent', isActive: true },
      { _id: 'e3', fullName: 'Mohamed Gharbi', department: 'Production', jobTitle: 'Operator', isActive: false }
    ]
  });

  readonly zoneId = computed(() => this.route.snapshot.paramMap.get('id') ?? '');

  readonly devicesCount = computed(() => this.zone()?.devices?.length ?? 0);
  readonly sensorsCount = computed(() => this.zone()?.sensors?.length ?? 0);
  readonly employeesCount = computed(() => this.zone()?.employees?.length ?? 0);

  back() {
    this.router.navigate(['/admin/zones']);
  }

  edit() {
    const z = this.zone();
    if (!z?._id) return;
    this.router.navigate(['/admin/zones/edit', z._id]);
  }

  riskKey(level: string | undefined): string {
    return `ZONES.RISK.${String(level ?? 'low').toLowerCase()}`;
  }

  riskClass(level: string | undefined): string {
    const v = String(level ?? 'low').toLowerCase();
    if (v === 'low') return 'ok';
    if (v === 'medium') return 'warn';
    return 'bad';
  }

  statusKey(active: boolean | undefined): string {
    return active ? 'ZONES.OVERVIEW.STATUS.active' : 'ZONES.OVERVIEW.STATUS.inactive';
  }

  deviceStatusKey(status: string | undefined): string {
    return `DEVICES.STATUS.${String(status ?? 'offline').toLowerCase()}`;
  }

  sensorStatusKey(status: string | undefined): string {
    return `SENSORS.STATUS.${String(status ?? 'offline').toLowerCase()}`;
  }

  employeeStatusKey(active: boolean | undefined): string {
    return active ? 'EMPLOYEES.STATUS.ACTIVE' : 'EMPLOYEES.STATUS.INACTIVE';
  }

  badgeClass(status: string | undefined): string {
    const v = String(status ?? '').toLowerCase();
    if (v === 'online' || v === 'active') return 'ok';
    if (v === 'maintenance' || v === 'warning') return 'warn';
    return 'bad';
  }

  value(v: any): string {
    return v === null || v === undefined || v === '' ? '—' : String(v);
  }

  sensorTypeKey(type: string | undefined): string {
    return `SENSORS.TYPE.${String(type ?? 'unknown').toLowerCase()}`;
  }

  trackById = (_: number, item: { _id: string }) => item._id;
}