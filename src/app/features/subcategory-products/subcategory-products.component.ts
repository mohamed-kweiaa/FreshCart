import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { CategoriesService } from '../../core/services/categories.service';
import { Products } from '../../core/models/products.interface';
import { ProductsSharedComponent } from '../../shared/products-shared/products-shared.component';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { HeroComponent, Breadcrumb } from '../../shared/ui/hero/hero.component';
import { FormsModule } from '@angular/forms';
import { computed } from '@angular/core';

@Component({
  selector: 'app-subcategory-products',
  imports: [RouterLink, ProductsSharedComponent, LoadingComponent, FormsModule, HeroComponent],
  templateUrl: './subcategory-products.component.html',
  styleUrl: './subcategory-products.component.css',
})
export class SubcategoryProductsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);

  productsList = signal<Products[]>([]);
  filterName = signal<string>('');
  filterType = signal<'subcategory' | 'category' | 'brand'>('subcategory');
  selectedSubcategoryId = signal<string>('');
  categoryId = signal<string>('');
  brandId = signal<string>('');
  siblingSubcategories = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  heroBreadcrumbs = computed<Breadcrumb[]>(() => {
    const crumbs: Breadcrumb[] = [];
    if (this.filterType() === 'brand') {
      crumbs.push({ label: 'Brands', url: '/brands' });
    } else {
      crumbs.push({ label: 'Categories', url: '/categories' });
    }
    crumbs.push({ label: this.filterName() || 'Products' });
    return crumbs;
  });

  heroIcon = computed(() => {
    if (this.filterType() === 'brand') return 'fa-tag';
    if (this.filterType() === 'category') return 'fa-layer-group';
    return 'fa-folder-open';
  });

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const subcategoryId = params.get('subcategory');
      const categoryFilterId = params.get('category');
      const brandFilterId = params.get('brand');
      const name = params.get('name');
      const catId = params.get('categoryId');

      if (name) {
        this.filterName.set(name);
      }

      if (categoryFilterId) {
        
        //! Filtering by parent category (from navbar dropdown)
        this.filterType.set('category');
        this.categoryId.set(categoryFilterId);
        this.isLoading.set(true);
        this.getProductsByCategory(categoryFilterId);
        this.loadSiblingSubcategories(categoryFilterId);
      } else if (brandFilterId) {

        //! Filtering by brand
        this.filterType.set('brand');
        this.brandId.set(brandFilterId);
        this.isLoading.set(true);
        this.getProductsByBrand(brandFilterId);
      } else if (subcategoryId) {

        //! Filtering by subcategory (from subcategory page)

        this.filterType.set('subcategory');
        this.selectedSubcategoryId.set(subcategoryId);
        this.isLoading.set(true);
        this.getProductsBySubcategory(subcategoryId);

        if (catId && catId !== this.categoryId()) {
          this.categoryId.set(catId);
          this.loadSiblingSubcategories(catId);
        }
      }
    });
  }

  loadSiblingSubcategories(categoryId: string): void {
    this.categoriesService.getSubCategories(categoryId).subscribe({
      next: (res) => {
        this.siblingSubcategories.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getProductsBySubcategory(subcategoryId: string): void {
    this.productsService.getProductsBySubcategory(subcategoryId).subscribe({
      next: (res) => {
        this.productsList.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.isLoading.set(false);
      },
    });
  }

  getProductsByCategory(categoryId: string): void {
    this.productsService.getProductsByCategory(categoryId).subscribe({
      next: (res) => {
        this.productsList.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.isLoading.set(false);
      },
    });
  }

  getProductsByBrand(brandId: string): void {
    this.productsService.getProductsByBrand(brandId).subscribe({
      next: (res) => {
        this.productsList.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.isLoading.set(false);
      },
    });
  }

  onSubcategoryChange(value: string): void {
    if (value === 'all') {
      this.router.navigate(['/products'], {
        queryParams: {
          category: this.categoryId(),
          name: this.filterName(),
        },
      });
    } else {
      const selected = this.siblingSubcategories().find(s => s._id === value);
      if (selected) {
        this.router.navigate(['/products'], {
          queryParams: {
            subcategory: selected._id,
            name: selected.name,
            categoryId: this.categoryId(),
          },
        });
      }
    }
  }
}
