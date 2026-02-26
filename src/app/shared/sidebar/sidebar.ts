import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive , TranslateModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  // Structure de données pour le menu (plus facile à maintenir)
  menuSections = [
    {
      title: 'MAIN',
      items: [
        { label: 'Dashboard', icon: 'bi-grid', route: '/home' }
      ]
    },
    {
      title: 'APPS',
      items: [
        { label: 'Apps', icon: 'bi-box-arrow-in-down', route: '/apps' }
      ]
    },
    {
      title: 'ELEMENTS',
      items: [
        { label: 'Components', icon: 'bi-compass', route: '/components' },
        { label: 'Elements', icon: 'bi-database', route: '/elements' },
        { label: 'Advanced UI', icon: 'bi-cube', route: '/ui' }
      ]
    }
  ];
}