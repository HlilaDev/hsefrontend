import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceServices } from '../../../../core/services/devices/device-services';

type CommandLog = {
  time: string;
  action: string;
  status: 'success' | 'pending' | 'failed';
  source: string;
};

@Component({
  selector: 'app-device-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './device-management.html',
  styleUrl: './device-management.scss',
})
export class DeviceManagement {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private deviceService = inject(DeviceServices);

  deviceId = this.route.snapshot.paramMap.get('id') ?? '';

  device = {
    name: 'ESP8266 - Zone A',
    deviceId: this.deviceId || 'esp8266-01',
    type: 'ESP8266',
    zone: 'Production Line A',
    status: 'online',
    ipAddress: '192.168.1.45',
    macAddress: '84:F3:EB:12:9A:44',
    firmware: 'v1.4.2',
    broker: '10.190.49.242',
    port: 1883,
    samplingInterval: 10,
    threshold: 75,
    uptime: '3d 12h 18m',
    lastSync: '2026-03-07 18:42',
    battery: 92,
    signal: -61,
  };

  mqttEnabled = signal(true);
  maintenanceMode = signal(false);
  alertMode = signal(true);
  autoReconnect = signal(true);

  logs: CommandLog[] = [
    { time: '18:41', action: 'Ping device', status: 'success', source: 'Dashboard' },
    { time: '18:37', action: 'Restart device', status: 'success', source: 'Dashboard' },
    { time: '18:25', action: 'Update threshold', status: 'pending', source: 'Admin panel' },
    { time: '17:58', action: 'Sync time', status: 'success', source: 'System' },
    { time: '17:30', action: 'Factory reset request', status: 'failed', source: 'Dashboard' },
  ];

  selectedAction = signal<string>('None');
  showConfirmModal = signal(false);
  confirmTitle = signal('');
  confirmText = signal('');
  actionLoading = signal(false);
  actionError = signal<string | null>(null);

  onAction(action: string) {
    this.selectedAction.set(action);
    this.confirmTitle.set(action);
    this.confirmText.set(
      `This action will send a command to device ${this.device.deviceId}.`
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

    this.logs = [
      {
        time: 'Now',
        action,
        status: 'pending',
        source: 'Dashboard',
      },
      ...this.logs,
    ];

    this.showConfirmModal.set(false);
  }

  restartDevice() {
    if (!this.deviceId) {
      this.actionError.set('Device id not found in route.');
      return;
    }

    this.actionLoading.set(true);
    this.actionError.set(null);

    this.deviceService.restartDevice(this.deviceId).subscribe({
      next: () => {
        this.logs = [
          {
            time: 'Now',
            action: 'Restart device',
            status: 'success',
            source: 'Dashboard',
          },
          ...this.logs,
        ];

        this.showConfirmModal.set(false);
        this.actionLoading.set(false);
      },
      error: (err) => {
        this.actionError.set(
          err?.error?.message ?? 'Failed to send restart command.'
        );

        this.logs = [
          {
            time: 'Now',
            action: 'Restart device',
            status: 'failed',
            source: 'Dashboard',
          },
          ...this.logs,
        ];

        this.actionLoading.set(false);
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

  getStatusClass(status: string) {
    return status.toLowerCase();
  }

  onBack() {
    this.router.navigate(['/admin/devices']);
  }
}