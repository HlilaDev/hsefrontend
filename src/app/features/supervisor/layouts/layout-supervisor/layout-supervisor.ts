import { Component } from '@angular/core';
import { Footer } from "../../../../shared/footer/footer";
import { SidebarSupervisor } from "../sidebar-supervisor/sidebar-supervisor";
import { HeaderSupervisor } from "../header-supervisor/header-supervisor";

@Component({
  selector: 'app-layout-supervisor',
  imports: [Footer, SidebarSupervisor, HeaderSupervisor],
  templateUrl: './layout-supervisor.html',
  styleUrl: './layout-supervisor.scss',
})
export class LayoutSupervisor {

}
