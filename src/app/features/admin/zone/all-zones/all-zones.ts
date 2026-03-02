import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { ZoneServices, Zone } from '../../../../core/services/zones/zone-services';

@Component({
  selector: 'app-all-zones',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './all-zones.html',
  styleUrl: './all-zones.scss',
})
export class AllZones {
  private zoneService = inject(ZoneServices);
  private t = inject(TranslateService);

  zones: Zone[] = [];
  loading = true;
  errorMessageKey = '';

  constructor() {
    this.loadZones();
  }

  trackById = (_: number, z: any) => z?._id || z?.id;

  getRowId(z: any): string {
    return z?._id || z?.id;
  }

  // i18n key helper: ZONES.RISK.low|medium|high
  riskKey(z: any): string {
    return 'ZONES.RISK.' + (z?.riskLevel ?? 'low');
  }

  riskClass(z: any): string {
    const r = z?.riskLevel;
    if (r === 'high') return 'high';
    if (r === 'medium') return 'medium';
    return 'low';
  }

  loadZones() {
    this.loading = true;
    this.errorMessageKey = '';

    this.zoneService.getAllZones().subscribe({
      next: (res: any) => {
        this.zones = res?.items ?? res?.zones ?? res ?? [];
        this.loading = false;
      },
      error: () => {
        this.errorMessageKey = 'ZONES.ERROR.LOAD';
        this.loading = false;
      },
    });
  }

  toggleActive(zone: any) {
    const id = this.getRowId(zone);
    const nextValue = !zone.isActive;

    // Optimistic update
    zone.isActive = nextValue;

    this.zoneService.toggleActive(id, nextValue).subscribe({
      next: () => {},
      error: () => {
        // rollback
        zone.isActive = !nextValue;
        alert(this.t.instant('ZONES.ERROR.TOGGLE_ACTIVE'));
      },
    });
  }

  deleteZone(zone: any) {
    const id = this.getRowId(zone);
    const msg = this.t.instant('ZONES.CONFIRM_DELETE');
    if (!confirm(msg)) return;

    this.zoneService.deleteZone(id).subscribe({
      next: () => {
        this.zones = this.zones.filter(z => this.getRowId(z) !== id);
      },
      error: () => alert(this.t.instant('ZONES.ERROR.DELETE')),
    });
  }
}