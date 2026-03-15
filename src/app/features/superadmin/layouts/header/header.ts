import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @Output() toggleSidebar = new EventEmitter<void>();

  readonly currentDate = new Date();
  readonly adminName = signal('Super Admin');

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}