import { Component } from '@angular/core';
import { SliderComponent } from './components/slider/slider.component';
import { CategoryHomeComponent } from './components/category-home/category-home.component';
import { ProductHomeComponent } from './components/product-home/product-home.component';
import { SubsComponent } from "./components/subs/subs.component";

@Component({
  selector: 'app-home',
  imports: [SliderComponent, CategoryHomeComponent, ProductHomeComponent, SubsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
