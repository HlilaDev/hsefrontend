import { Component, ElementRef, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { LanguageService, Lang } from '../../core/services/languages/language';
import { LayoutService } from '../../core/services/layout/layout';
import { AuthServices, User } from '../../core/services/auth/auth-services';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  layout = inject(LayoutService);
  lang = inject(LanguageService);
  private el = inject(ElementRef<HTMLElement>);

  isLangOpen = false;
  isUserOpen = false;

  // ✅ User chargé depuis /me
  user: User | null = null;

  // Optionnel: afficher loader / éviter flash
  isLoadingMe = false;

  constructor(private authservices: AuthServices, private router: Router) {}

  ngOnInit(): void {
    this.loadMe();
  }

  private loadMe(): void {
    this.isLoadingMe = true;

    this.authservices.me().subscribe({
      next: (res: any) => {
        // ton backend renvoie { user: req.user }
        this.user = res?.user ?? null;
        this.isLoadingMe = false;
      },
      error: () => {
        this.user = null;
        this.isLoadingMe = false;
        // si token invalide/expiré => redirect login
        this.router.navigate(['/login']);
      },
    });
  }

  get currentLang(): Lang {
    return this.lang.current;
  }

  // ---------- LANG MENU ----------
  toggleLangMenu(ev?: MouseEvent) {
    ev?.stopPropagation();
    this.isLangOpen = !this.isLangOpen;
    if (this.isLangOpen) this.isUserOpen = false; // ✅ un seul menu ouvert
  }

  chooseLang(code: Lang) {
    this.lang.setLang(code);
    this.isLangOpen = false;
  }

  // ---------- USER MENU ----------
  toggleUserMenu(ev?: MouseEvent) {
    ev?.stopPropagation();
    this.isUserOpen = !this.isUserOpen;
    if (this.isUserOpen) this.isLangOpen = false; // ✅ un seul menu ouvert
  }

  closeUserMenu() {
    this.isUserOpen = false;
  }

  logout() {
    this.authservices.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }

  // ---------- LAYOUT ----------
  onToggleSidebar() {
    this.layout.toggleSidebar();
  }

  // ---------- OUTSIDE CLICK / ESC ----------
  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) {
    const target = ev.target as Node;
    if (!this.el.nativeElement.contains(target)) {
      this.isLangOpen = false;
      this.isUserOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.isLangOpen = false;
    this.isUserOpen = false;
  }

  // Helpers UI (optionnel)
  get displayName(): string {
    return this.user?.fullName || '—';
  }

  get displayRole(): string {
    return this.user?.role || '';
  }

  get avatarUrl(): string {
    // si backend retourne avatar plus tard, adapte ici
    return 'assets/images/profile-pic.webp';
  }
}