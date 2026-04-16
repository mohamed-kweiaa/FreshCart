import { Component } from '@angular/core';
import { HeroComponent, Breadcrumb } from '../../shared/ui/hero/hero.component';

@Component({
  selector: 'app-terms',
  imports: [HeroComponent],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.css',
})
export class TermsComponent {
  termsBreadcrumbs: Breadcrumb[] = [
    { label: 'Terms of Service' }
  ];
}
