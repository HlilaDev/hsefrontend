import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

import {
  ReadingItem,
  ReadingServices,
} from '../../../../core/services/readings/reading';

@Component({
  selector: 'app-device-monitoring',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './device-monitoring.html',
  styleUrl: './device-monitoring.scss',
})
export class DeviceMonitoring implements OnInit {
  private route = inject(ActivatedRoute);
  private readingServices = inject(ReadingServices);
  private destroyRef = inject(DestroyRef);

  isLoading = signal(true);
  error = signal<string | null>(null);

  deviceId = signal('');
  latestReading = signal<ReadingItem | null>(null);
  history = signal<ReadingItem[]>([]);

  readonly deviceName = computed(() =>
    this.readingServices.getDeviceName(this.latestReading()?.device)
  );

  readonly zoneName = computed(() =>
    this.readingServices.getZoneName(this.latestReading()?.zone)
  );

  readonly temperature = computed(() =>
    this.readingServices.getTemperature(this.latestReading())
  );

  readonly humidity = computed(() =>
    this.readingServices.getHumidity(this.latestReading())
  );

  readonly gas = computed(() =>
    this.readingServices.getGas(this.latestReading())
  );

  readonly latestStatus = computed(() => {
    const device = this.latestReading()?.device;
    if (!device || typeof device === 'string') return 'unknown';
    return device.status || 'unknown';
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('deviceId') || '';
    this.deviceId.set(id);


    if (!id) {
      this.error.set('Identifiant du device introuvable.');
      this.isLoading.set(false);
      return;
    }

    this.loadDeviceMonitoring(id);
  }

  loadDeviceMonitoring(deviceId: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.readingServices.getLatestByDevice(deviceId).subscribe({
      next: (reading) => {
        this.latestReading.set(reading);
      },
      error: () => {
        this.error.set('Impossible de charger la dernière lecture du device.');
      },
    });

    this.readingServices
      .getHistoryByDevice(deviceId, { limit: 20 })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (items) => {
          this.history.set(items);
        },
        error: () => {
          this.error.set('Impossible de charger l’historique du device.');
        },
      });
  }

  refresh(): void {
    if (!this.deviceId()) return;
    this.loadDeviceMonitoring(this.deviceId());
  }

  formatValues(item: ReadingItem): string {
    const v = item.values || {};
    const parts: string[] = [];

    if (typeof v.temperature === 'number') parts.push(`${v.temperature} °C`);
    if (typeof v.humidity === 'number') parts.push(`${v.humidity} %`);
    if (typeof v.gas === 'number') parts.push(`Gaz: ${v.gas}`);

    return parts.length ? parts.join(' / ') : '—';
  }

  getStatusClass(status: string | null | undefined): string {
    switch ((status || '').toLowerCase()) {
      case 'online':
        return 'online';
      case 'offline':
        return 'offline';
      case 'maintenance':
        return 'maintenance';
      default:
        return 'unknown';
    }
  }

  asDeviceIdLabel(): string {
    return this.deviceName() && this.deviceName() !== '—'
      ? this.deviceName()
      : this.deviceId();
  }
}