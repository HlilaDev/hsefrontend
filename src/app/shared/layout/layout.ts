import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "../header/header";
import { Sidebar } from "../sidebar/sidebar";
import { Footer } from "../footer/footer"; 
import { LayoutService } from '../../core/services/layout/layout';


@Component({
  selector: 'app-layout',
  standalone: true, 
  imports: [
    RouterOutlet,
    Header,
    Sidebar,
    Footer
],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
    layout = inject(LayoutService);

}