import { Component, input } from '@angular/core';

@Component({
  selector: 'app-h2-sections-home',
  imports: [],
  templateUrl: './h2-sections-home.component.html',
  styleUrl: './h2-sections-home.component.css',
})
export class H2SectionsHomeComponent {
  mainText = input.required<string>();
  highlightText = input<string>('');
}
