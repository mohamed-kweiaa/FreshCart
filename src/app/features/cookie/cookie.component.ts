import { Component } from '@angular/core';
import { HeroComponent, Breadcrumb } from '../../shared/ui/hero/hero.component';

@Component({
  selector: 'app-cookie',
  imports: [HeroComponent],
  templateUrl: './cookie.component.html',
  styleUrl: './cookie.component.css',
})
export class CookieComponent {
  cookieBreadcrumbs: Breadcrumb[] = [
    { label: 'Cookie Policy' }
  ];
}
