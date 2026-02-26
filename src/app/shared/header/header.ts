import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService, Lang } from '../../core/services/languages/language';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  lang = inject(LanguageService);
  private el = inject(ElementRef<HTMLElement>);

  isLangOpen = false;

  get currentLang(): Lang {
    return this.lang.current;
  }

  toggleLangMenu() {
    this.isLangOpen = !this.isLangOpen;
  }

  chooseLang(code: Lang) {
    this.lang.setLang(code);
    this.isLangOpen = false;
  }

  // Fermer au clic dehors (best UX)
  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) {
    if (!this.isLangOpen) return;
    const target = ev.target as Node;
    if (!this.el.nativeElement.contains(target)) {
      this.isLangOpen = false;
    }
  }

  // Fermer avec ESC (accessibilité)
  @HostListener('document:keydown.escape')
  onEsc() {
    this.isLangOpen = false;
  }
}