import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UserServices } from '../../../../core/services/users/user-services';

export type User = {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'operator' | 'hseManager' | 'admin';
  createdAt?: string;
  updatedAt?: string;
};

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './all-users.html',
  styleUrl: './all-users.scss',
})
export class AllUsers {
  private userService = inject(UserServices);

  users: User[] = [];
  loading = true;
  errorMessage = '';

  constructor() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.errorMessage = '';

    // ⚠️ selon ton backend: /api/users renvoie soit {items:[]}, soit []
    this.userService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res?.items ?? res?.users ?? res ?? [];
        this.loading = false;
      },
      error: (e: any) => {
        this.errorMessage = e?.message || 'Erreur lors du chargement des utilisateurs';
        this.loading = false;
      },
    });
  }

  trackById = (_: number, u: any) => u?._id || u?.email;

  fullName(u: User) {
    return `${u.firstName} ${u.lastName}`.trim();
  }

  roleText(role: User['role']) {
    if (role === 'admin') return 'Admin';
    if (role === 'hseManager') return 'HSE Manager';
    return 'Operator';
  }

  deleteUser(id: string) {
    if (!confirm('Confirmer la suppression ?')) return;

    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u._id !== id);
      },
      error: (e: any) => alert(e?.message || 'Suppression impossible'),
    });
  }
}