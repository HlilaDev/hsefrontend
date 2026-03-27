import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

import {
  ObservationService,
  Observation,
  ObservationStatus,
  ObservationSeverity,
  ObservationUser,
} from '../../../../core/services/observations/observation-services';

import {
  User,
  UserServices,
} from '../../../../core/services/users/user-services';

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
  private userServices = inject(UserServices);
  private destroyRef = inject(DestroyRef);

  loading = signal(true);
  error = signal('');
  observation = signal<Observation | null>(null);
  selectedImageIndex = signal(0);

  assigning = signal(false);
  assignError = signal('');
  assignSuccess = signal('');

  agentsLoading = signal(false);
  agentsError = signal('');
  agents = signal<User[]>([]);
  selectedAgentId = signal('');

  selectedImage = computed(() => {
    const obs = this.observation();
    if (!obs?.images?.length) return null;
    return obs.images[this.selectedImageIndex()] || null;
  });

  selectedAgentName = computed(() => {
    const agent = this.agents().find((item) => item._id === this.selectedAgentId());
    return agent ? this.getTeamUserName(agent) : '';
  });

  constructor() {
    this.loadPage();
  }

  loadPage(): void {
    this.loadObservation();
    this.loadAgents();
  }

  loadObservation(): void {
    this.loading.set(true);
    this.error.set('');
    this.assignError.set('');
    this.assignSuccess.set('');

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

          const assignedId =
            data?.assignedTo && typeof data.assignedTo !== 'string'
              ? data.assignedTo._id || ''
              : '';

          this.selectedAgentId.set(assignedId);
        },
        error: (err) => {
          console.error(err);
          this.error.set(
            err?.error?.message ||
              'Impossible de charger les détails de l’observation.'
          );
        },
      });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  loadAgents(): void {
    this.agentsLoading.set(true);
    this.agentsError.set('');

    const sub = this.userServices
      .getTeam()
      .pipe(finalize(() => this.agentsLoading.set(false)))
      .subscribe({
        next: (res: any) => {
          const items = Array.isArray(res?.items)
            ? res.items
            : Array.isArray(res)
            ? res
            : [];

          const onlyAgents = items.filter(
            (user: any) => user?.role === 'agent'
          );

          this.agents.set(onlyAgents);
        },
        error: (err: Error) => {
          console.error(err);
          this.agentsError.set(
            err?.message || 'Impossible de charger la liste des agents.'
          );
        },
      });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  refresh(): void {
    this.loadPage();
  }

  goBack(): void {
    this.router.navigate(['/manager/observations']);
  }

  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  onSelectedAgentChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value ?? '';
    this.selectedAgentId.set(value);
    this.assignError.set('');
    this.assignSuccess.set('');
  }

  assignObservation(): void {
    const obs = this.observation();
    const agentId = this.selectedAgentId().trim();

    if (!obs?._id) {
      this.assignError.set('Observation introuvable.');
      return;
    }

    if (!agentId) {
      this.assignError.set('Veuillez choisir un agent.');
      return;
    }

    this.assigning.set(true);
    this.assignError.set('');
    this.assignSuccess.set('');

    const sub = this.observationService
      .assign(obs._id, { assignedTo: agentId })
      .pipe(finalize(() => this.assigning.set(false)))
      .subscribe({
        next: (updated) => {
          this.observation.set(updated);

          const assignedId =
            updated?.assignedTo && typeof updated.assignedTo !== 'string'
              ? updated.assignedTo._id || ''
              : agentId;

          this.selectedAgentId.set(assignedId);
          this.assignSuccess.set('Observation affectée avec succès.');
        },
        error: (err) => {
          console.error(err);
          this.assignError.set(
            err?.error?.message || 'Impossible d’affecter cette observation.'
          );
        },
      });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  zoneName(): string {
    const obs = this.observation();
    if (!obs?.zone) return '-';
    return typeof obs.zone === 'string' ? obs.zone : obs.zone.name || '-';
  }

  reporterName(): string {
    const obs = this.observation();
    return this.getObservationUserName(obs?.reportedBy);
  }

  reporterEmail(): string {
    const obs = this.observation();
    return this.getObservationUserEmail(obs?.reportedBy);
  }

  assignedToName(): string {
    const obs = this.observation();
    return this.getObservationUserName(obs?.assignedTo, 'Non affectée');
  }

  assignedToEmail(): string {
    const obs = this.observation();
    return this.getObservationUserEmail(obs?.assignedTo);
  }

  assignedByName(): string {
    const obs = this.observation();
    return this.getObservationUserName(obs?.assignedBy, 'Non défini');
  }

  assignedAtLabel(): string {
    const obs = this.observation();
    if (!obs?.assignedAt) return '-';
    return new Date(obs.assignedAt).toLocaleString('fr-FR');
  }

  hasImages(): boolean {
    return !!this.observation()?.images?.length;
  }

  imageCount(): number {
    return this.observation()?.images?.length || 0;
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

  getImageUrl(url?: string): string {
    if (!url) return '';

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    const normalized = url.startsWith('/') ? url : `/${url}`;
    return `http://localhost:5000${normalized}`;
  }

  trackByAgent = (_: number, agent: User) => agent?._id || _;

  private getObservationUserName(
    user?: string | ObservationUser | null,
    fallback = '-'
  ): string {
    if (!user) return fallback;
    if (typeof user === 'string') return user;

    return (
      user.fullName ||
      `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
      user.name ||
      user.email ||
      fallback
    );
  }

  private getObservationUserEmail(
    user?: string | ObservationUser | null
  ): string {
    if (!user || typeof user === 'string') return '-';
    return user.email || '-';
  }

  private getTeamUserName(user?: User | null): string {
    if (!user) return '-';
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
  }
}