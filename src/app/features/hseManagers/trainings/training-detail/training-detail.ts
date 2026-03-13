import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';

import { TrainingServices } from '../../../../core/services/trainings/training-services';

type Category = 'safety' | 'environment' | 'quality' | 'security' | 'other';
type TrainingStatus = 'scheduled' | 'completed' | 'cancelled';
type ParticipantStatus = 'planned' | 'attended' | 'passed' | 'failed';

type TrainingParticipant = {
  _id?: string;
  employee?: {
    _id: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    employeeId?: string;
    department?: string;
    jobTitle?: string;
  } | null;
  status?: ParticipantStatus;
  score?: number;
  validUntil?: string | Date;
  note?: string;
};

type TrainingDetailModel = {
  _id: string;
  title: string;
  description?: string;
  category: Category;
  provider?: string;
  location?: string;
  startDate: string | Date;
  endDate?: string | Date;
  status: TrainingStatus;
  participants?: TrainingParticipant[];
  createdBy?: {
    _id: string;
    name?: string;
    email?: string;
    role?: string;
  } | null;
  company?: {
    _id: string;
    name?: string;
  } | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

@Component({
  selector: 'app-training-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './training-detail.html',
  styleUrl: './training-detail.scss',
})
export class TrainingDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private trainingsService = inject(TrainingServices);

  isLoading = signal(true);
  error = signal<string | null>(null);
  training = signal<TrainingDetailModel | null>(null);

  ngOnInit(): void {
    this.loadTraining();
  }

  loadTraining(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');

          if (!id) {
            this.error.set('Identifiant de formation introuvable.');
            this.isLoading.set(false);
            return of(null);
          }

          return this.trainingsService.getTrainingById(id).pipe(
            catchError((err) => {
              console.error('Get training detail error:', err);
              this.error.set(
                err?.error?.message || 'Erreur lors du chargement de la formation.'
              );
              this.isLoading.set(false);
              return of(null);
            })
          );
        })
      )
      .subscribe((response) => {
        this.training.set(response);
        this.isLoading.set(false);
      });
  }

  goBack(): void {
    this.router.navigate(['/manager/trainings']);
  }

  goEdit(): void {
    const id = this.training()?._id;
    if (!id) return;
    this.router.navigate(['/manager/trainings', id, 'edit']);
  }

  categoryLabel(category: Category | undefined): string {
    switch (category) {
      case 'safety':
        return 'Safety';
      case 'environment':
        return 'Environment';
      case 'quality':
        return 'Quality';
      case 'security':
        return 'Security';
      case 'other':
        return 'Other';
      default:
        return '-';
    }
  }

  statusLabel(status: TrainingStatus | undefined): string {
    switch (status) {
      case 'scheduled':
        return 'Prévu';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return '-';
    }
  }

  participantStatusLabel(status: ParticipantStatus | undefined): string {
    switch (status) {
      case 'planned':
        return 'Prévu';
      case 'attended':
        return 'Présent';
      case 'passed':
        return 'Réussi';
      case 'failed':
        return 'Échoué';
      default:
        return '-';
    }
  }

  badgeClass(status: TrainingStatus | undefined): string {
    return status === 'scheduled'
      ? 'badge scheduled'
      : status === 'completed'
      ? 'badge completed'
      : 'badge cancelled';
  }

  participantBadgeClass(status: ParticipantStatus | undefined): string {
    return status === 'planned'
      ? 'mini-badge planned'
      : status === 'attended'
      ? 'mini-badge attended'
      : status === 'passed'
      ? 'mini-badge passed'
      : 'mini-badge failed';
  }

  fmtDate(value: string | Date | undefined): string {
    if (!value) return '-';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';

    return date.toLocaleDateString();
  }

  employeeName(participant: TrainingParticipant): string {
    const employee = participant.employee;
    if (!employee) return 'Employé supprimé';

    return (
      employee.fullName ||
      `${employee.firstName ?? ''} ${employee.lastName ?? ''}`.trim() ||
      employee.employeeId ||
      'Employé'
    );
  }

  employeeMeta(participant: TrainingParticipant): string {
    const employee = participant.employee;
    if (!employee) return '-';

    const parts = [
      employee.employeeId,
      employee.department,
      employee.jobTitle,
    ].filter(Boolean);

    return parts.length ? parts.join(' • ') : '-';
  }
}