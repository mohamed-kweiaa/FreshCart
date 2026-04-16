import { Injectable, inject, signal, PLATFORM_ID, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);

  isDarkMode = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('freshcart-theme');
      if (saved) {
        this.isDarkMode.set(saved === 'dark');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.isDarkMode.set(prefersDark);
      }
      this.applyTheme();
    }

    //! React to signal changes
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.applyTheme();
      }
    });
  }

  toggleTheme(): void {
    this.isDarkMode.update((v) => !v);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('freshcart-theme', this.isDarkMode() ? 'dark' : 'light');
    }
  }

  private applyTheme(): void {
    const html = document.documentElement;
    if (this.isDarkMode()) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }
}
