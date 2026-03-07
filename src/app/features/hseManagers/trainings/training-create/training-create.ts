import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';

// ✅ adapte les chemins
import { TrainingServices } from '../../../../core/services/trainings/training-services';
import { EmployeeServices } from '../../../../core/services/employees/employee-services';

type Category = 'safety' | 'environment' | 'quality' | 'security' | 'other';
type Status = 'scheduled' | 'completed' | 'cancelled';

type EmployeeLite = {
  _id: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  badgeId?: string;
};

@Component({
  selector: 'app-training-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './training-create.html',
  styleUrl: './training-create.scss',
})
export class TrainingCreate {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  private trainingsService = inject(TrainingServices);
  private employeesService = inject(EmployeeServices);

  // ✅ pour le template
  isLoading = signal(false);
  error = signal<string | null>(null);

  employees = signal<EmployeeLite[]>([]);
  selectedEmployeeIds = signal<string[]>([]);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    category: ['safety' as Category, Validators.required],
    provider: [''],
    location: [''],
    startDate: ['', Validators.required],
    endDate: [''],
    status: ['scheduled' as Status, Validators.required],
    participants: this.fb.array([]),
  });

  ngOnInit() {
    this.loadEmployees();
  }

  // ------- helpers form -------
  get participantsFA(): FormArray {
    return this.form.get('participants') as FormArray;
  }

  fieldInvalid(name: string) {
    const c = this.form.get(name);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  // ------- employees -------
  private loadEmployees() {
    // ✅ adapte le nom de méthode si besoin: getAllEmployees / allEmployees ...
    this.employeesService.getAllEmployees()
      .pipe(
        catchError(() => {
          this.error.set("Impossible de charger la liste des employés.");
          return of([]);
        })
      )
      .subscribe((rows: any) => {
        const list = Array.isArray(rows) ? rows : (rows?.data ?? []);
        this.employees.set(list);
      });
  }

  employeeLabel(e: EmployeeLite | undefined | null) {
    if (!e) return 'Employé';
    const name =
      e.fullName ||
      (e.firstName || e.lastName ? `${e.firstName ?? ''} ${e.lastName ?? ''}`.trim() : '') ||
      e.name ||
      'Employé';
    return e.badgeId ? `${name} • ${e.badgeId}` : name;
  }

  employeeLabelById(empId: string) {
    const e = this.employees().find(x => x._id === empId);
    return this.employeeLabel(e);
  }

  // ✅ appelée par (change) du select multiple
  onEmployeesSelectChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const ids = Array.from(select.selectedOptions).map(o => o.value);
    this.onEmployeesChange(ids);
  }

  onEmployeesChange(ids: string[]) {
    this.selectedEmployeeIds.set(ids);

    const next = new Set(ids);

    // remove unselected participants
    for (let i = this.participantsFA.length - 1; i >= 0; i--) {
      const empId = this.participantsFA.at(i).get('employee')?.value;
      if (empId && !next.has(empId)) {
        this.participantsFA.removeAt(i);
      }
    }

    // add new selected
    const existing = new Set(this.participantsFA.controls.map(c => c.get('employee')?.value));
    ids.forEach(empId => {
      if (!existing.has(empId)) {
        this.participantsFA.push(
          this.fb.group({
            employee: [empId, Validators.required],
            status: ['planned'],
            score: [null],
            validUntil: [''],
            note: [''],
          })
        );
      }
    });
  }

  removeParticipantById(empId: string) {
    for (let i = this.participantsFA.length - 1; i >= 0; i--) {
      const id = this.participantsFA.at(i).get('employee')?.value;
      if (id === empId) this.participantsFA.removeAt(i);
    }

    // sync selected list
    const ids = this.selectedEmployeeIds().filter(x => x !== empId);
    this.selectedEmployeeIds.set(ids);
  }

  // ------- submit -------
  submit() {
    this.error.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Veuillez corriger les champs obligatoires.');
      return;
    }

    const v = this.form.getRawValue();

    // dates check
    if (v.endDate && v.startDate && new Date(v.endDate) < new Date(v.startDate)) {
      this.error.set('La date de fin doit être après la date de début.');
      return;
    }

    const dto = {
      title: v.title!,
      description: v.description || undefined,
      category: v.category!,
      provider: v.provider || undefined,
      location: v.location || undefined,
      startDate: new Date(v.startDate!).toISOString(),
      endDate: v.endDate ? new Date(v.endDate).toISOString() : undefined,
      status: v.status!,
      participants: (v.participants || []).map((p: any) => ({
        employee: p.employee,
        status: p.status || 'planned',
        score: p.score ?? undefined,
        validUntil: p.validUntil ? new Date(p.validUntil).toISOString() : undefined,
        note: p.note || undefined,
      })),
    };

    this.isLoading.set(true);

    this.trainingsService.createTraining(dto)
      .pipe(
        catchError((err) => {
          this.error.set(err?.error?.message || 'Création échouée.');
          return of(null);
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe((res: any) => {
        if (!res) return;
        // ✅ retour vers list
        this.router.navigate(['../'], { relativeTo: this.router.routerState.root.firstChild?.firstChild ?? undefined });
        // sinon absolu:
        // this.router.navigate(['/hsemanager/trainings']);
      });
  }
}