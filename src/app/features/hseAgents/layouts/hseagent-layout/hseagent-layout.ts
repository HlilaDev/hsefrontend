import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HseagentSidebar } from '../hseagent-sidebar/hseagent-sidebar';
import { Header } from '../../../../shared/header/header';
import { Footer } from '../../../../shared/footer/footer';
import { LayoutService } from '../../../../core/services/layout/layout';

@Component({
  selector: 'app-hseagent-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    HseagentSidebar,
    Header,
    Footer,
  ],
  templateUrl: './hseagent-layout.html',
  styleUrl: './hseagent-layout.scss',
})
export class HseagentLayout {
  layout = inject(LayoutService);
}