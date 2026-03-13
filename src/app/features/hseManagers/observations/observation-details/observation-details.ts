import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

import {
  ObservationService,
  Observation,
  ObservationStatus,
  ObservationSeverity,
} from '../../../../core/services/observations/observation-services';

@Component({
  selector: 'app-observation-details',
  standalone: true,
  imports: [CommonModule, NgClass, DatePipe, RouterModule],
  templateUrl: './observation-details.html',
  styleUrl: './observation-details.scss',
})
export class ObservationDetails {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private observationService = inject(ObservationService);
  private destroyRef = inject(DestroyRef);

  loading = signal(true);
  error = signal('');
  observation = signal<Observation | null>(null);
  selectedImageIndex = signal(0);

  selectedImage = computed(() => {
    const obs = this.observation();
    if (!obs?.images?.length) return null;
    return obs.images[this.selectedImageIndex()] || null;
  });

  constructor() {
    this.loadObservation();
  }

  loadObservation(): void {
    this.loading.set(true);
    this.error.set('');

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('Identifiant de l’observation introuvable.');
      this.loading.set(false);
      return;
    }

    const sub = this.observationService
      .getById(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => {
          this.observation.set(data);
          this.selectedImageIndex.set(0);
        },
        error: (err) => {
          console.error(err);
          this.error.set(
            err?.error?.message || 'Impossible de charger les détails de l’observation.'
          );
        },
      });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  refresh(): void {
    this.loadObservation();
  }

  goBack(): void {
    this.router.navigate(['/manager/observations']);
  }

  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  zoneName(): string {
    const obs = this.observation();
    if (!obs?.zone) return '-';
    return typeof obs.zone === 'string' ? obs.zone : obs.zone.name || '-';
  }

  reporterName(): string {
    const obs = this.observation();
    if (!obs?.reportedBy) return '-';

    if (typeof obs.reportedBy === 'string') return obs.reportedBy;

    return (
      obs.reportedBy.fullName ||
      obs.reportedBy.name ||
      obs.reportedBy.email ||
      '-'
    );
  }

  reporterEmail(): string {
    const obs = this.observation();
    if (!obs?.reportedBy || typeof obs.reportedBy === 'string') return '-';
    return obs.reportedBy.email || '-';
  }

  getSeverityLabel(value?: ObservationSeverity): string {
    switch (value) {
      case 'low':
        return 'Faible';
      case 'medium':
        return 'Moyenne';
      case 'high':
        return 'Élevée';
      case 'critical':
        return 'Critique';
      default:
        return '-';
    }
  }

  getStatusLabel(value?: ObservationStatus): string {
    switch (value) {
      case 'open':
        return 'Ouverte';
      case 'in_progress':
        return 'En cours';
      case 'closed':
        return 'Clôturée';
      default:
        return '-';
    }
  }

  hasImages(): boolean {
    return !!this.observation()?.images?.length;
  }

  imageCount(): number {
    return this.observation()?.images?.length || 0;
  }

  getImageUrl(url?: string): string {
    if (!url) return '';

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    const normalized = url.startsWith('/') ? url : `/${url}`;
    return `http://localhost:5000${normalized}`;
  }
}