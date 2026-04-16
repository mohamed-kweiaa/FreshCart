import { Component, inject, OnInit, signal } from '@angular/core';
import { H2SectionsHomeComponent } from "../h2-sections-home/h2-sections-home.component";
import { CategoriesService } from '../../../../core/services/categories.service';
import { Categories } from '../../../../core/models/categories.interface';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-category-home',
  imports: [H2SectionsHomeComponent, RouterLink],
  templateUrl: './category-home.component.html',
  styleUrl: './category-home.component.css',
})
export class CategoryHomeComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);

  categoriesList = signal<Categories[]>([] as Categories[])

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
