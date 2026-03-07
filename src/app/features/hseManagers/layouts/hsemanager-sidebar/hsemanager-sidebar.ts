import { Component } from '@angular/core';
import { Sidebar } from '../../../../shared/sidebar/sidebar';
import { HSEMANAGER_SECTIONS } from '../../../../shared/sidebar/config/hsemanager.sidebar.config';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-hsemanager-sidebar',
  standalone: true,
  imports: [Sidebar , RouterModule],
  template: `
    <app-sidebar
      [sections]="sections"
      [brand]="brand">
    </app-sidebar>
  `,
})
export class HsemanagerSidebar {

  // Sections du menu (importées depuis le fichier config)
  sections = HSEMANAGER_SECTIONS;

  // Configuration du branding du sidebar
  brand = {
    title: 'HSE',
    accent: 'Manager',
    subtitle: 'hseMonitor',
    logoSrc: 'assets/images/logo.png',
    homeLink: '/hsemanager',
  };  

}