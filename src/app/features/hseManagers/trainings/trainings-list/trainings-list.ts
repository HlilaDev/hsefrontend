import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';

// ✅ adapte le chemin selon ton projet
import { TrainingServices } from '../../../../core/services/trainings/training-services';

type Category = 'safety' | 'environment' | 'quality' | 'security' | 'other';
type TrainingStatus = 'scheduled' | 'completed' | 'cancelled';

type Training = {
  _id: string;
  title: string;
  description?: string;
  category: Category;
  provider?: string;
  location?: string;
  startDate: string | Date;
  endDate?: string | Date;
  status: TrainingStatus;
  participants?: Array<any>;
};

type SortKey = 'startDate_desc' | 'startDate_asc' | 'title_asc' | 'title_desc';

@Component({
  selector: 'app-trainings-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './trainings-list.html',
  styleUrl: './trainings-list.scss',
})
export class TrainingsList {
  private trainingsService = inject(TrainingServices);
  private router = inject(Router);

  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  trainings = signal<Training[]>([]);

  // UI state
  q = signal<string>('');
  category = signal<Category | 'all'>('all');
  status = signal<TrainingStatus | 'all'>('all');
  sort = signal<SortKey>('startDate_desc');

  filtered = computed(() => {
    const q = this.q().trim().toLowerCase();
    const cat = this.category();
    const st = this.status();
    const sort = this.sort();

    let list = [...this.trainings()];

    if (q) {
      list = list.filter(t =>
        (t.title || '').toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q) ||
        (t.provider || '').toLowerCase().includes(q) ||
        (t.location || '').toLowerCase().includes(q)
      );
    }

    if (cat !== 'all') list = list.filter(t => t.category === cat);
    if (st !== 'all') list = list.filter(t => t.status === st);

    const toTime = (d: any) => new Date(d).getTime();

    list.sort((a, b) => {
      switch (sort) {
        case 'startDate_asc':
          return toTime(a.startDate) - toTime(b.startDate);
        case 'startDate_desc':
          return toTime(b.startDate) - toTime(a.startDate);
        case 'title_asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'title_desc':
          return (b.title || '').localeCompare(a.title || '');
      }
    });

    return list;
  });

  ngOnInit() {
    this.fetch();
  }

  fetch() {
    this.isLoading.set(true);
    this.error.set(null);

    this.trainingsService.getAllTrainings()
      .pipe(
        catchError((err) => {
          this.error.set(err?.error?.message || 'Erreur lors du chargement des trainings.');
          return of([]);
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe((rows: any) => {
        const list = Array.isArray(rows) ? rows : (rows?.data ?? []);
        this.trainings.set(list);
      });
  }

  // labels
  categoryLabel(cat: Category) {
    switch (cat) {
      case 'safety': return 'Safety';
      case 'environment': return 'Environment';
      case 'quality': return 'Quality';
      case 'security': return 'Security';
      case 'other': return 'Other';
    }
  }

  statusLabel(st: TrainingStatus) {
    switch (st) {
      case 'scheduled': return 'Prévu';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
    }
  }

  badgeClass(st: TrainingStatus) {
    return st === 'scheduled' ? 'badge scheduled'
      : st === 'completed' ? 'badge completed'
      : 'badge cancelled';
  }

  participantsCount(t: Training) {
    return t.participants?.length ?? 0;
  }

  fmtDate(d: any) {
    if (!d) return '-';
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return '-';
    return dt.toLocaleDateString();
  }

  goCreate() {
    // ✅ route relative simple
    this.router.navigate(['trainings/create'], { relativeTo: this.router.routerState.root.firstChild?.firstChild ?? undefined });

    // si jamais relative pose souci -> utilise absolu:
    // this.router.navigate(['/hsemanager/trainings/create']);
  }

  goDetail(id: string) {
    this.router.navigate([id], { relativeTo: this.router.routerState.root.firstChild?.firstChild ?? undefined });
    // absolu: this.router.navigate(['/hsemanager/trainings', id]);
  }

  goEdit(id: string) {
    this.router.navigate([id, 'edit'], { relativeTo: this.router.routerState.root.firstChild?.firstChild ?? undefined });
    // absolu: this.router.navigate(['/hsemanager/trainings', id, 'edit']);
  }

  deleteTraining(id: string) {
    const ok = confirm('Supprimer cette formation ?');
    if (!ok) return;

    this.isLoading.set(true);
    this.error.set(null);

    this.trainingsService.deleteTraining(id)
      .pipe(
        catchError((err) => {
          this.error.set(err?.error?.message || 'Suppression échouée.');
          return of(null);
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe(() => this.fetch());
  }

  resetFilters() {
    this.q.set('');
    this.category.set('all');
    this.status.set('all');
    this.sort.set('startDate_desc');
  }
}