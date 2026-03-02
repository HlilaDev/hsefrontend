import { Component } from '@angular/core';
import { Header } from "../../../../shared/header/header";
import { Footer } from "../../../../shared/footer/footer";
import { RouterOutlet } from "@angular/router";
import { SidebarAdmin } from "../sidebar-admin/sidebar-admin";
import { LayoutService } from '../../../../core/services/layout/layout';

@Component({
  selector: 'app-layout-admin',
  imports: [Header, Footer, RouterOutlet, SidebarAdmin],
  templateUrl: './layout-admin.html',
  styleUrl: './layout-admin.scss',
})
export class LayoutAdmin {
  constructor(public layout: LayoutService) {}


}
