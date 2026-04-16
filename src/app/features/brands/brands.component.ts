import { Component, inject, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { BrandsService } from '../../core/services/brands.service';
import { Brands } from '../../core/models/brands.interface';
import { HeroComponent, Breadcrumb } from '../../shared/ui/hero/hero.component';

@Component({
  selector: 'app-brands',
  imports: [RouterLink, HeroComponent],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent {
  private brandService = inject(BrandsService);
  brandsList = signal<Brands[]>([] as Brands[]);

  brandsBreadcrumbs: Breadcrumb[] = [
    { label: 'Brands' }
  ];

  ngOnInit(): void {
    this.getBrands();

  }

  getBrands() {
    this.brandService.getBrands().subscribe({
      next: (res) => {
        this.brandsList.set(res.data);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
