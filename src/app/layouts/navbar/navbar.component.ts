import { isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { initFlowbite } from 'flowbite';
import { FlowbiteService } from './../../core/services/flowbite.service';
import { CategoriesService } from '../../core/services/categories.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';
import { Categories } from '../../core/models/categories.interface';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  private readonly platformId = inject(PLATFORM_ID);
  readonly wishlistService = inject(WishlistService);
  readonly cartService = inject(CartService);
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);

  isLoggedIn = computed(() => this.authService.isLogged());

  categoriesList = signal<Categories[]>([]);

  constructor(private FlowbiteService: FlowbiteService) {}

  ngOnInit(): void {
    this.FlowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
    this.loadCategories();

    //! Load wishlist & cart counts on startup (browser-only)
    if (isPlatformBrowser(this.platformId)) {
      this.wishlistService.getWishlist().subscribe();
      this.cartService.getLoggedUserCart().subscribe();
    }
  }

  loadCategories(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categoriesList.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  signOut(): void {
    this.authService.logOut();
    //! Switch back to anonymous data immediately
    this.wishlistService.getWishlist().subscribe();
    this.cartService.getLoggedUserCart().subscribe();
  }
}
