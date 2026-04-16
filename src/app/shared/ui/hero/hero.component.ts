import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Breadcrumb {
  label: string;
  url?: string;
}

@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  title = input.required<string>();
  subtitle = input<string>('');
  icon = input<string>('fa-box-open'); 
  gradient = input<string>('from-emerald-600 via-emerald-500 to-emerald-400');
  breadcrumbs = input<Breadcrumb[]>([]);
}
