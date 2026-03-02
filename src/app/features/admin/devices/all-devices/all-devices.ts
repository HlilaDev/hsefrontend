import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { DeviceServices, Device } from '../../../../core/services/devices/device-services';

@Component({
  selector: 'app-all-devices',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, DatePipe],
  templateUrl: './all-devices.html',
  styleUrl: './all-devices.scss',
})
export class AllDevices {
  private deviceService = inject(DeviceServices);
  private t = inject(TranslateService);

  // i18n keys
  titleKey = 'DEVICES.TITLE';
  addLabelKey = 'DEVICES.ADD_BTN';
  emptyKey = 'DEVICES.EMPTY';

  // state
  devices: Device[] = [];
  loading = true;
  errorMessageKey = '';

  constructor() {
    this.loadDevices();
  }

  // trackBy
  trackByDevice = (_: number, d: any) => d?._id || d?.deviceId;

  // Helpers (pour éviter logique complexe dans le HTML)
  getRowId(d: any): string {
    return d?._id || d?.deviceId;
  }

  getZoneName(d: any): string {
    const z = d?.zone;
    if (!z) return '—';
    if (typeof z === 'object') return z?.name ?? '—';
    return '—';
  }

  getStatusKey(d: any): string {
    // ex: DEVICES.STATUS.online
    return 'DEVICES.STATUS.' + (d?.status ?? 'offline');
  }

  isOnline(d: any): boolean {
    return d?.status === 'online';
  }

  hasSensors(d: any): boolean {
    return Array.isArray(d?.sensors) && d.sensors.length > 0;
  }

  // API
  loadDevices() {
    this.loading = true;
    this.errorMessageKey = '';

    this.deviceService.getAllDevices().subscribe({
      next: (res: any) => {
        this.devices = res?.items ?? res?.devices ?? res ?? [];
        this.loading = false;
      },
      error: () => {
        this.errorMessageKey = 'DEVICES.ERROR.LOAD';
        this.loading = false;
      },
    });
  }

  deleteDevice(idOrDeviceId: string) {
    const msg = this.t.instant('DEVICES.CONFIRM_DELETE');
    if (!confirm(msg)) return;

    this.deviceService.deleteDevice(idOrDeviceId).subscribe({
      next: () => {
        this.devices = this.devices.filter(
          d => (d as any)._id !== idOrDeviceId && d.deviceId !== idOrDeviceId
        );
      },
      error: () => alert(this.t.instant('DEVICES.ERROR.DELETE')),
    });
  }
}