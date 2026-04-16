import { Component } from '@angular/core';
import { HeroComponent, Breadcrumb } from '../../shared/ui/hero/hero.component';

@Component({
  selector: 'app-privacy',
  imports: [HeroComponent],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.css',
})
export class PrivacyComponent {
  privacyBreadcrumbs: Breadcrumb[] = [
    { label: 'Privacy Policy' }
  ];
}
