import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { EmployeeServices, Employee } from '../../../../core/services/employees/employee-services';

@Component({
  selector: 'app-all-employees',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, DatePipe],
  templateUrl: './all-employees.html',
  styleUrl: './all-employees.scss',
})
export class AllEmployees {
  private employeeService = inject(EmployeeServices);

  employees: Employee[] = [];
  loading = true;

  constructor() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (res: any) => {
        this.employees = res?.items ?? res ?? [];
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  deleteEmployee(id: string) {
    if (!confirm('Delete employee?')) return;

    this.employeeService.deleteEmployee(id).subscribe(() => {
      this.employees = this.employees.filter(e => e._id !== id);
    });
  }

  toggleActive(e: Employee) {
    this.employeeService.toggleActive(e._id!, !e.isActive).subscribe(() => {
      e.isActive = !e.isActive;
    });
  }

  trackById = (_: number, e: Employee) => e._id;
}