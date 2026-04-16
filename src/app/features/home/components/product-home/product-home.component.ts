import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { H2SectionsHomeComponent } from '../h2-sections-home/h2-sections-home.component';
import { ProductsSharedComponent } from "../../../../shared/products-shared/products-shared.component";

@Component({
  selector: 'app-product-home',
  imports: [H2SectionsHomeComponent, ProductsSharedComponent, RouterLink],
  templateUrl: './product-home.component.html',
  styleUrl: './product-home.component.css',
})
export class ProductHomeComponent {}
