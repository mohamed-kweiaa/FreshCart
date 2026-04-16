import { Component, inject, OnInit, signal } from '@angular/core';

import { RouterLink } from "@angular/router";
import { CategoriesService } from '../../core/services/categories.service';
import { Categories } from '../../core/models/categories.interface';
import { HeroComponent, Breadcrumb } from '../../shared/ui/hero/hero.component';

@Component({
  selector: 'app-categories',
  imports: [RouterLink, HeroComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);

  categoriesList = signal<Categories[]>([] as Categories[]);

  categoriesBreadcrumbs: Breadcrumb[] = [
    { label: 'Categories' }
  ];

  ngOnInit(): void {
    this.getAllCategoriesData();
  }



  getAllCategoriesData():void{
    this.categoriesService.getAllCategories().subscribe({
      next:(res)=>{
        this.categoriesList.set(res.data);
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
}
