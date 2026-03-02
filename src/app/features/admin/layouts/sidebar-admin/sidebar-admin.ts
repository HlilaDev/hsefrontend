import { Component, HostBinding } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

type MenuItem = {
  label: string;
  icon: string;     // bootstrap icons class
  link: string;
};

@Component({
  selector: 'app-sidebar-admin',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar-admin.html',
  styleUrl: './sidebar-admin.scss',
})
export class SidebarAdmin {
  // Optionnel: mode réduit
  collapsed = false;

  menu: MenuItem[] = [
    { label: 'Zones', icon: 'bi bi-geo-alt', link: '/admin/zones' },
    { label: 'Devices', icon: 'bi bi-cpu', link: '/admin/devices' },
   { label: 'Employees', icon: 'bi bi-cpu', link: '/admin/employees' },
      { label: 'Users', icon: 'bi bi-cpu', link: '/admin/users' },
    { label: 'Settings', icon: 'bi bi-gear', link: '/admin/settings' },
  ];

  toggle() {
    this.collapsed = !this.collapsed;
  }

  // Ajoute une classe au host quand collapsed
  @HostBinding('class.collapsed')
  get isCollapsed() {
    return this.collapsed;
  }
}