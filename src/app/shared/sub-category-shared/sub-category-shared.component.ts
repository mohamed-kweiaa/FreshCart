import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { CategoriesService } from '../../core/services/categories.service';
import { Categories } from '../../core/models/categories.interface';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-sub-category-shared',
  imports: [RouterLink, LoadingComponent],
  templateUrl: './sub-category-shared.component.html',
  styleUrl: './sub-category-shared.component.css',
})
export class SubCategorySharedComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly categoriesService = inject(CategoriesService);

  subCategoriesList = signal<Categories[]>([] as Categories[])
  categoryName = signal<string>('');
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.isLoading.set(true);
      const id = params.get('id')!;
      this.getSubCategoriesData(id);
      this.getCategoryData(id);
    });
  }

  
  getSubCategoriesData(id:string):void{
    this.categoriesService.getSubCategories(id).subscribe({
      next:(res)=>{
        this.subCategoriesList.set(res.data);
        this.isLoading.set(false);
      },
      error:(err)=>{
        console.log(err);
        this.isLoading.set(false);
      }
    })
  }

  getCategoryData(id:string):void{
    this.categoriesService.getSpecificCategory(id).subscribe({
      next:(res)=>{
        this.categoryName.set(res.data.name);
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

}
