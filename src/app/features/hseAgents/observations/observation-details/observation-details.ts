import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import {
  ObservationImage,
  ObservationService,
  ObservationSeverity,
  ObservationStatus,
} from '../../../../core/services/observations/observation-services';

import { AuthServices } from '../../../../core/services/auth/auth-services';
import { BASE_URL } from '../../../../core/config/api_urls';

type ObservationUserRef =
  | string
  | {
      _id: string;
      fullName?: string;
      firstName?: string;
      lastName?: string;
      name?: string;
      email?: string;
      role?: string;
    }
  | null
  | undefined;

type ObservationItem = {
  _id: string;
  title: string;
  description: string;
  severity: ObservationSeverity;
  status: ObservationStatus;
  zone?: { _id: string; name: string };
  reportedBy?: ObservationUserRef;
  assignedTo?: ObservationUserRef;
  assignedBy?: ObservationUserRef;
  assignedAt?: string | null;
  images?: { url: string; uploadedAt?: string }[];
  resolutionComment?: string;
  resolutionImages?: { url: string; uploadedAt?: string }[];
  resolvedAt?: string | null;
  resolvedBy?: ObservationUserRef;
  validationComment?: string;
  validatedAt?: string | null;
  validatedBy?: ObservationUserRef;
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
  private auth = inject(AuthServices);

  loading = signal(true);
  errorMsg = signal<string | null>(null);
  actionError = signal<string | null>(null);
  actionSuccess = signal<string | null>(null);
  submittingResolution = signal(false);

  id = signal<string>('');
  obs = signal<ObservationItem | null>(null);

  meId = signal<string>('');

  resolutionComment = signal('');
  proofImageUrl = signal('');

  hasImages = computed(() => (this.obs()?.images?.length ?? 0) > 0);
  hasResolutionImages = computed(
    () => (this.obs()?.resolutionImages?.length ?? 0) > 0
  );

  isAssignedToMe = computed(() => {
    const assignedId = this.getUserId(this.obs()?.assignedTo);
    return !!assignedId && assignedId === this.meId();
  });

  canSubmitResolution = computed(() => {
    const current = this.obs();
    if (!current) return false;
    if (!this.isAssignedToMe()) return false;

    return current.status === 'in_progress' || current.status === 'reopened';
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.id.set(id);

    if (!id) {
      this.loading.set(false);
      this.errorMsg.set('ID observation manquant.');
      return;
    }

    this.loadCurrentUser();
  }

  private loadCurrentUser() {
    this.auth.me().subscribe({
      next: (res: any) => {
        this.meId.set(res?.user?._id || '');
        this.load(this.id());
      },
      error: () => {
        this.load(this.id());
      },
    });
  }

  load(id: string) {
    this.loading.set(true);
    this.errorMsg.set(null);
    this.actionError.set(null);
    this.actionSuccess.set(null);

    this.obsService.getById(id).subscribe({
      next: (res: any) => {
        const item = (res?.observation ?? res?.item ?? res) as ObservationItem;
        this.obs.set(item);
        this.resolutionComment.set(item?.resolutionComment || '');
        this.loading.set(false);
      },
      error: (err: any) => {
        this.loading.set(false);
        this.errorMsg.set(
          err?.error?.message || "Impossible de charger l'observation."
        );
      },
    });
  }

  submitResolution() {
    const current = this.obs();
    if (!current || !this.canSubmitResolution()) return;

    this.submittingResolution.set(true);
    this.actionError.set(null);
    this.actionSuccess.set(null);

    const comment = this.resolutionComment().trim();
    const imageUrl = this.proofImageUrl().trim();

    const resolutionImages: ObservationImage[] = imageUrl
      ? [{ url: imageUrl }]
      : [];

    this.obsService
      .resolve(current._id, {
        resolutionComment: comment,
        resolutionImages,
      })
      .subscribe({
        next: (res: any) => {
          const item = (res?.observation ?? res?.item ?? res) as ObservationItem;
          this.obs.set(item);
          this.resolutionComment.set(item?.resolutionComment || '');
          this.proofImageUrl.set('');
          this.submittingResolution.set(false);
          this.actionSuccess.set(
            'Le traitement a été soumis avec succès pour validation.'
          );
        },
        error: (err: any) => {
          this.submittingResolution.set(false);
          this.actionError.set(
            err?.error?.message || 'Impossible de soumettre le traitement.'
          );
        },
      });
  }

  onResolutionComment(value: string) {
    this.resolutionComment.set(value);
  }

  onProofImageUrl(value: string) {
    this.proofImageUrl.set(value);
  }

  getUserId(user: ObservationUserRef): string {
    if (!user) return '';
    return typeof user === 'string' ? user : user._id || '';
  }

  getUserDisplayName(user: ObservationUserRef): string {
    if (!user) return '—';
    if (typeof user === 'string') return user;

    return (
      user.fullName ||
      user.name ||
      `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
      user.email ||
      '—'
    );
  }

  getUserEmail(user: ObservationUserRef): string {
    if (!user || typeof user === 'string') return '—';
    return user.email || '—';
  }

  formatDate(iso?: string | null) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';

    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(d);
  }

  normalizeUrl(url?: string) {
    if (!url) return '';
    const raw = url.trim();

    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;

    const clean = raw.startsWith('/') ? raw.slice(1) : raw;
    return `${BASE_URL}${clean}`;
  }

  openImage(url: string) {
    const full = this.normalizeUrl(url);
    if (full) window.open(full, '_blank', 'noopener,noreferrer');
  }

  trackByUrl = (_: number, it: { url: string }) => it.url;
}