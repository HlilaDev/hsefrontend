import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import {
  ObservationService,
  ObservationSeverity,
  ObservationStatus,
} from '../../../../core/services/observations/observation-services';

import { BASE_URL } from '../../../../core/config/api_urls'; // ✅ adapte le chemin si besoin

type ObservationItem = {
  _id: string;
  title: string;
  description: string;
  severity: ObservationSeverity;
  status: ObservationStatus;
  zone?: { _id: string; name: string };
  reportedBy?: { _id: string; name?: string; email?: string };
  images?: { url: string; uploadedAt?: string }[];
  createdAt?: string;
};

@Component({
  selector: 'app-observation-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './observation-details.html',
  styleUrl: './observation-details.scss',
})
export class ObservationDetails {
  private route = inject(ActivatedRoute);
  private obsService = inject(ObservationService);

  loading = signal(true);
  errorMsg = signal<string | null>(null);

  id = signal<string>('');
  obs = signal<ObservationItem | null>(null);

  hasImages = computed(() => (this.obs()?.images?.length ?? 0) > 0);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.id.set(id);

    if (!id) {
      this.loading.set(false);
      this.errorMsg.set('ID observation manquant.');
      return;
    }

    this.load(id);
  }

  load(id: string) {
    this.loading.set(true);
    this.errorMsg.set(null);

    this.obsService.getById(id).subscribe({
      next: (res: any) => {
        const item = (res?.observation ?? res?.item ?? res) as ObservationItem;
        this.obs.set(item);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.loading.set(false);
        this.errorMsg.set(err?.error?.message || "Impossible de charger l'observation.");
      },
    });
  }

  formatDate(iso?: string) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleString();
  }

  /**
   * ✅ Fix images:
   * - "/uploads/xxx.jpg" => "http://localhost:5000/uploads/xxx.jpg"
   * - "uploads/xxx.jpg"  => "http://localhost:5000/uploads/xxx.jpg"
   * - "xxx.jpg"          => "http://localhost:5000/xxx.jpg" (rare)
   */
  normalizeUrl(url?: string) {
    if (!url) return '';
    const raw = url.trim();

    // déjà absolue
    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;

    // rendre relative propre
    const clean = raw.startsWith('/') ? raw.slice(1) : raw;

    // BASE_URL finit par "/"
    return `${BASE_URL}${clean}`;
  }

  openImage(url: string) {
    const full = this.normalizeUrl(url);
    if (full) window.open(full, '_blank', 'noopener,noreferrer');
  }

  trackByUrl = (_: number, it: { url: string }) => it.url;
}