import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../../../../shared/footer/footer';
import { LayoutService } from '../../../../core/services/layout/layout';
import { SidebarManager } from '../../layouts/sidebar-manager/sidebar-manager';
import { HeaderManager } from "../header-manager/header-manager";

@Component({
  selector: 'app-hsemanager-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    Footer,
    SidebarManager,
    HeaderManager
],
  templateUrl: './hsemanager-layout.html',
  styleUrl: './hsemanager-layout.scss',
})
export class HsemanagerLayout {
  layout = inject(LayoutService);
}