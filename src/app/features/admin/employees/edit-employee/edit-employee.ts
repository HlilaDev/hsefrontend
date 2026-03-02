import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { EmployeeServices, Employee } from '../../../../core/services/employees/employee-services';
import { ZoneServices } from '../../../../core/services/zones/zone-services';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit-employee.html',
  styleUrl: './edit-employee.scss',
})
export class EditEmployee {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private employeeService = inject(EmployeeServices);
  private zoneService = inject(ZoneServices);

  id = '';
  zones: any[] = [];

  loadingZones = true;
  loadingEmployee = true;
  submitting = false;

  errorMessage = '';

  form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    employeeId: [''],
    department: [''],
    jobTitle: [''],
    zone: [''],      // zoneId
    phone: [''],
    hireDate: [''],  // yyyy-MM-dd
    isActive: [true],
  });

  constructor() {
    this.id = this.route.snapshot.paramMap.get('id') || '';

    this.loadZones();
    this.loadEmployee();
  }

  get f() {
    return this.form.controls;
  }

  private loadZones() {
    this.loadingZones = true;
    this.zoneService.getAllZones().subscribe({
      next: (res: any) => {
        this.zones = res?.items ?? res?.zones ?? res ?? [];
        this.loadingZones = false;
      },
      error: () => {
        this.zones = [];
        this.loadingZones = false;
      },
    });
  }

  private loadEmployee() {
    if (!this.id) {
      this.errorMessage = 'Missing employee id';
      this.loadingEmployee = false;
      return;
    }

    this.loadingEmployee = true;
    this.employeeService.getEmployeeById(this.id).subscribe({
      next: (emp: Employee | any) => {
        // zone peut être string ou objet populé
        const zoneId =
          typeof emp.zone === 'string' ? emp.zone : (emp.zone?._id ?? '');

        this.form.patchValue({
          fullName: emp.fullName ?? '',
          employeeId: emp.employeeId ?? '',
          department: emp.department ?? '',
          jobTitle: emp.jobTitle ?? '',
          zone: zoneId || '',
          phone: emp.phone ?? '',
          hireDate: this.toDateInput(emp.hireDate),
          isActive: emp.isActive ?? true,
        });

        this.loadingEmployee = false;
      },
      error: (e: any) => {
        this.errorMessage = e?.message || 'Failed to load employee';
        this.loadingEmployee = false;
      },
    });
  }

  submit() {
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;

    const v = this.form.value;

    const payload: any = {
      fullName: v.fullName?.trim(),
      employeeId: v.employeeId?.trim() || null,
      department: v.department?.trim() || null,
      jobTitle: v.jobTitle?.trim() || null,
      zone: v.zone || null,
      phone: v.phone?.trim() || null,
      hireDate: v.hireDate || null,
      isActive: v.isActive ?? true,
    };

    this.employeeService.updateEmployee(this.id, payload).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/admin/employees']);
      },
      error: (e: any) => {
        this.submitting = false;
        this.errorMessage = e?.message || 'Failed to update employee';
      },
    });
  }

  // Convertit une date backend -> yyyy-MM-dd (pour input date)
  private toDateInput(value: any): string {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime())) return '';
    const yyyy = String(d.getFullYear());
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}