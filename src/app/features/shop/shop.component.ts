import { Component, inject, OnInit, signal, computed, PLATFORM_ID } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { Products } from '../../core/models/products.interface';
import { ProductsSharedComponent } from '../../shared/products-shared/products-shared.component';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { HeroComponent, Breadcrumb } from '../../shared/ui/hero/hero.component';
import { FlowbiteService } from '../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-shop',
  imports: [ProductsSharedComponent, LoadingComponent, HeroComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit {
  private readonly platformId: any = inject(PLATFORM_ID);
  private readonly productsService = inject(ProductsService);

  productsList = signal<Products[]>([]);
  isLoading = signal<boolean>(true);
  currentPage = signal<number>(1);
  totalResults = signal<number>(0);
  numberOfPages = signal<number>(1);
  limit = 20;

  shopBreadcrumbs: Breadcrumb[] = [{ label: 'All Products' }];

  pages = computed(() => {
    const total = this.numberOfPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  constructor(private flowbiteService: FlowbiteService) {}

  ngOnInit(): void {
    this.loadProducts(1);
  }

  loadProducts(page: number): void {
    this.isLoading.set(true);
    this.currentPage.set(page);
    this.productsService.getProductsPaginated(page, this.limit).subscribe({
      next: (res) => {
        this.productsList.set(res.data);
        this.totalResults.set(res.results);
        if (res.metadata) {
          this.numberOfPages.set(res.metadata.numberOfPages);
          this.currentPage.set(res.metadata.currentPage);
        }
        this.isLoading.set(false);
        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.flowbiteService.loadFlowbite(() => {
            initFlowbite();
          });
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading.set(false);
      },
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.numberOfPages()) {
      this.loadProducts(page);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.loadProducts(this.currentPage() - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.numberOfPages()) {
      this.loadProducts(this.currentPage() + 1);
    }
  }
}
