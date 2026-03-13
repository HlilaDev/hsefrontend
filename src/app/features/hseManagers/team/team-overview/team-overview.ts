import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type TeamStatus = 'online' | 'offline' | 'busy' | 'onLeave';
type TeamRole = 'hseManager' | 'supervisor' | 'hseAgent' | 'technician' | 'employee';

interface TeamMember {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: TeamRole;
  zone: string;
  status: TeamStatus;
  avatar?: string;
  lastSeen: string;
}

@Component({
  selector: 'app-team-overview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './team-overview.html',
  styleUrl: './team-overview.scss',
})
export class TeamOverview {
  search = signal('');
  selectedRole = signal('all');
  selectedStatus = signal('all');
  viewMode = signal<'table' | 'cards'>('table');

  team = signal<TeamMember[]>([
    {
      _id: 'TM-001',
      fullName: 'Ahmed Ben Salah',
      email: 'ahmed.bensalah@hse.local',
      phone: '+216 20 111 222',
      role: 'supervisor',
      zone: 'Production A',
      status: 'online',
      lastSeen: 'Now',
    },
    {
      _id: 'TM-002',
      fullName: 'Sarra Trabelsi',
      email: 'sarra.trabelsi@hse.local',
      phone: '+216 21 334 455',
      role: 'hseManager',
      zone: 'Warehouse',
      status: 'busy',
      lastSeen: '5 min ago',
    },
    {
      _id: 'TM-003',
      fullName: 'Youssef Gharbi',
      email: 'youssef.gharbi@hse.local',
      phone: '+216 23 555 666',
      role: 'hseAgent',
      zone: 'Chemical Zone',
      status: 'online',
      lastSeen: 'Now',
    },
    {
      _id: 'TM-004',
      fullName: 'Amira Jlassi',
      email: 'amira.jlassi@hse.local',
      phone: '+216 25 777 888',
      role: 'technician',
      zone: 'Maintenance',
      status: 'offline',
      lastSeen: '32 min ago',
    },
    {
      _id: 'TM-005',
      fullName: 'Walid Mzoughi',
      email: 'walid.mzoughi@hse.local',
      phone: '+216 27 444 999',
      role: 'employee',
      zone: 'Packaging',
      status: 'onLeave',
      lastSeen: 'Today 08:15',
    },
    {
      _id: 'TM-006',
      fullName: 'Meriem Hadded',
      email: 'meriem.hadded@hse.local',
      phone: '+216 29 123 456',
      role: 'hseAgent',
      zone: 'Production B',
      status: 'online',
      lastSeen: 'Now',
    },
  ]);

  filteredTeam = computed(() => {
    const q = this.search().trim().toLowerCase();
    const role = this.selectedRole();
    const status = this.selectedStatus();

    return this.team().filter((member) => {
      const matchesSearch =
        !q ||
        member.fullName.toLowerCase().includes(q) ||
        member.email.toLowerCase().includes(q) ||
        member.zone.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q);

      const matchesRole = role === 'all' || member.role === role;
      const matchesStatus = status === 'all' || member.status === status;

      return matchesSearch && matchesRole && matchesStatus;
    });
  });

  totalMembers = computed(() => this.team().length);
  onlineCount = computed(() => this.team().filter((m) => m.status === 'online').length);
  busyCount = computed(() => this.team().filter((m) => m.status === 'busy').length);
  offlineCount = computed(() => this.team().filter((m) => m.status === 'offline').length);

  setView(mode: 'table' | 'cards'): void {
    this.viewMode.set(mode);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  getRoleLabel(role: TeamRole): string {
    switch (role) {
      case 'hseManager':
        return 'HSE Manager';
      case 'supervisor':
        return 'Supervisor';
      case 'hseAgent':
        return 'HSE Agent';
      case 'technician':
        return 'Technician';
      case 'employee':
        return 'Employee';
      default:
        return role;
    }
  }

  getStatusLabel(status: TeamStatus): string {
    switch (status) {
      case 'online':
        return 'Online';
      case 'offline':
        return 'Offline';
      case 'busy':
        return 'Busy';
      case 'onLeave':
        return 'On Leave';
      default:
        return status;
    }
  }

  trackById(index: number, item: TeamMember): string {
    return item._id;
  }
}