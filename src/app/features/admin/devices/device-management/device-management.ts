import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import {
  Device,
  DeviceServices,
} from '../../../../core/services/devices/device-services';

type CommandLog = {
  time: string;
  action: string;
  status: 'success' | 'pending' | 'failed';
  source: string;
};

type DeviceDetails = Device & {
  ipAddress?: string;
  macAddress?: string;
  firmware?: string;
  broker?: string;
  port?: number;
  samplingInterval?: number;
  threshold?: number;
  uptime?: string;
  battery?: number;
  signal?: number;
};

@Component({
  selector: 'app-device-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './device-management.html',
  styleUrl: './device-management.scss',
})
export class DeviceManagement implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private deviceService = inject(DeviceServices);

  deviceId = this.route.snapshot.paramMap.get('id') ?? '';

  loading = signal(true);
  error = signal<string | null>(null);

  device = signal<DeviceDetails | null>(null);

  mqttEnabled = signal(true);
  maintenanceMode = signal(false);
  alertMode = signal(true);
  autoReconnect = signal(true);

  logs = signal<CommandLog[]>([
    { time: '18:41', action: 'Ping device', status: 'success', source: 'Dashboard' },
    { time: '18:37', action: 'Restart device', status: 'success', source: 'Dashboard' },
    { time: '18:25', action: 'Update threshold', status: 'pending', source: 'Admin panel' },
    { time: '17:58', action: 'Sync time', status: 'success', source: 'System' },
    { time: '17:30', action: 'Factory reset request', status: 'failed', source: 'Dashboard' },
  ]);

  selectedAction = signal<string>('None');
  showConfirmModal = signal(false);
  confirmTitle = signal('');
  confirmText = signal('');
  actionLoading = signal(false);
  actionError = signal<string | null>(null);

  zoneName = computed(() => {
    const current = this.device();
    if (!current) return '—';

    return typeof current.zone === 'string'
      ? current.zone
      : current.zone?.name || current.zone?._id || '—';
  });

  displayName = computed(() => {
    const current = this.device();
    if (!current) return 'Device';

    return current.name?.trim() || current.deviceId || 'Device';
  });

  ngOnInit(): void {
    this.loadDevice();
  }

  loadDevice() {
    if (!this.deviceId) {
      this.error.set('Device id not found in route.');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.deviceService
      .getDeviceById(this.deviceId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (result) => {
          this.device.set({
            ...result,
            // valeurs UI par défaut tant qu’elles n’existent pas en base
            ipAddress: '—',
            macAddress: '—',
            firmware: '—',
            broker: '10.190.49.242',
            port: 1883,
            samplingInterval: 10,
            threshold: 75,
            uptime: '—',
            battery: 0,
            signal: 0,
          });
        },
        error: (err) => {
          this.error.set(err?.error?.message ?? 'Failed to load device.');
        },
      });
  }

  onAction(action: string) {
    const current = this.device();

    this.selectedAction.set(action);
    this.confirmTitle.set(action);
    this.confirmText.set(
      `This action will send a command to device ${current?.deviceId ?? this.deviceId}.`
    );
    this.actionError.set(null);
    this.showConfirmModal.set(true);
  }

  closeModal() {
    if (this.actionLoading()) return;
    this.showConfirmModal.set(false);
  }

  confirmAction() {
    const action = this.selectedAction();

    if (action === 'Restart device') {
      this.restartDevice();
      return;
    }

    this.logs.update((current) => [
      {
        time: 'Now',
        action,
        status: 'pending',
        source: 'Dashboard',
      },
      ...current,
    ]);

    this.showConfirmModal.set(false);
  }

  restartDevice() {
    if (!this.deviceId) {
      this.actionError.set('Device id not found in route.');
      return;
    }

    this.actionLoading.set(true);
    this.actionError.set(null);

    this.deviceService
      .restartDevice(this.deviceId)
      .pipe(finalize(() => this.actionLoading.set(false)))
      .subscribe({
        next: () => {
          this.logs.update((current) => [
            {
              time: 'Now',
              action: 'Restart device',
              status: 'success',
              source: 'Dashboard',
            },
            ...current,
          ]);

          this.showConfirmModal.set(false);
        },
        error: (err) => {
          this.actionError.set(
            err?.error?.message ?? 'Failed to send restart command.'
          );

          this.logs.update((current) => [
            {
              time: 'Now',
              action: 'Restart device',
              status: 'failed',
              source: 'Dashboard',
            },
            ...current,
          ]);
        },
      });
  }

  toggleMqtt() {
    this.mqttEnabled.update((v) => !v);
  }

  toggleMaintenance() {
    this.maintenanceMode.update((v) => !v);
  }

  toggleAlertMode() {
    this.alertMode.update((v) => !v);
  }

  toggleReconnect() {
    this.autoReconnect.update((v) => !v);
  }

  getStatusClass(status?: string) {
    return (status ?? 'offline').toLowerCase();
  }

  onBack() {
    this.router.navigate(['/admin/devices']);
  }
}