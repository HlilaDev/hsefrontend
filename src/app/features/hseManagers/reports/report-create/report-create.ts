import { Component, DestroyRef, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';

import { ReportServices } from '../../../../core/services/reports/report-services';
import { ZoneServices } from '../../../../core/services/zones/zone-services';

type ZoneLite = { _id: string; name: string };
type ReportType = 'weekly' | 'monthly' | 'yearly' | 'audit' | 'custom';

@Component({
  selector: 'app-report-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './report-create.html',
  styleUrl: './report-create.scss',
})
export class ReportCreate implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  private reportsApi = inject(ReportServices);
  private zonesApi = inject(ZoneServices);

  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly zones = signal<ZoneLite[]>([]);

  // form
  readonly form = this.fb.group({
    title: [''],
    type: ['weekly' as ReportType, Validators.required],
    zone: [''], // optional
    startDate: [''], // "YYYY-MM-DD"
    endDate: [''],   // "YYYY-MM-DD"
    isAutomatic: [true],

    // metrics (optional)
    totalIncidents: [0],
    totalObservations: [0],
    complianceRate: [0],

    // export (optional)
    exportUrl: [''],
  });

  readonly dateError = computed(() => {
    const s = this.form.value.startDate;
    const e = this.form.value.endDate;
    if (!s || !e) return false;
    return new Date(e).getTime() <= new Date(s).getTime();
  });

  ngOnInit(): void {
    this.loadZones();
  }

  fieldInvalid(name: string) {
    const c = this.form.get(name);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  private loadZones() {
    const obs$ = (this.zonesApi as any).allZones
      ? (this.zonesApi as any).allZones()
      : (this.zonesApi as any).getAllZones
        ? (this.zonesApi as any).getAllZones()
        : null;

    if (!obs$) return;

    obs$
      .pipe(catchError(() => of([])))
      .subscribe((zs: any) => {
        const list = Array.isArray(zs) ? zs : (zs?.items ?? []);
        this.zones.set(list.map((z: any) => ({ _id: z._id, name: z.name })));
      });
  }

  submit() {
    this.error.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.dateError()) {
      this.error.set('EndDate doit être strictement supérieure à StartDate.');
      return;
    }

    const v = this.form.value;

    // payload backend (match your mongoose schema)
    const payload: any = {
      type: v.type,
      title: v.title || undefined,
      startDate: v.startDate ? new Date(v.startDate) : undefined,
      endDate: v.endDate ? new Date(v.endDate) : undefined,
      zone: v.zone || undefined,
      isAutomatic: !!v.isAutomatic,
      exportUrl: v.exportUrl || undefined,
      metrics: {
        totalIncidents: Number(v.totalIncidents ?? 0),
        totalObservations: Number(v.totalObservations ?? 0),
        complianceRate: Number(v.complianceRate ?? 0),
      },
    };

    // remove empty keys
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
    if (!payload.zone) delete payload.zone;

    this.loading.set(true);

    this.reportsApi.createReport(payload)
      .pipe(
        catchError((err) => {
          this.error.set(err?.error?.message || 'Erreur lors de la création du report.');
          return of(null);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe((created: any) => {
        if (!created) return;
        // go to details or list
        const id = created?._id;
        if (id) {
          this.router.navigate(['/hsemanager/reports', id]);
        } else {
          this.router.navigate(['/hsemanager/reports']);
        }
      });
  }
}