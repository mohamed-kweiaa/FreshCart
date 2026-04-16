import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';import { authGuard } from './core/auth/guards/auth.guard';
import { loggedGuard } from './core/auth/guards/logged.guard';

export const routes: Routes = [
  // Eagerly loaded for initial rendering performance
  {
    path: '',
    component: HomeComponent,
    title: 'FreshCart'
  },

  // Lazy-loaded standalone components
  {
    path: 'shop',
    loadComponent: () => import('./features/shop/shop.component').then(c => c.ShopComponent),
    title: 'Shop Page'
  },
  {
    path: 'categories',
    loadComponent: () => import('./features/categories/categories.component').then(c => c.CategoriesComponent),
    title: 'Category Page'
  },
  {
    path: 'categories/:id/:slug',
    loadComponent: () => import('./shared/sub-category-shared/sub-category-shared.component').then(c => c.SubCategorySharedComponent),
    title: 'Sub Category Page'
  },
  {
    path: 'products',
    loadComponent: () => import('./features/subcategory-products/subcategory-products.component').then(c => c.SubcategoryProductsComponent),
    title: 'Products'
  },
  {
    path: 'brands',
    loadComponent: () => import('./features/brands/brands.component').then(c => c.BrandsComponent),
    title: 'Brands Page'
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./features/wishlist/wishlist.component').then(c => c.WishlistComponent),
    title: 'Wishlist'
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then(c => c.CartComponent),
    title: 'Cart'
  },
  {
    path: 'details/:id/:slug',
    loadComponent: () => import('./features/details/details.component').then(c => c.DetailsComponent),
    title: 'Product Details'
  },
  {
    path: 'checkout/:cartId',
    canActivate: [authGuard],
    loadComponent: () => import('./features/checkout/checkout.component').then(c => c.CheckoutComponent),
    title: 'Checkout'
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () => import('./features/orders/orders.component').then(c => c.OrdersComponent),
    title: 'Orders'
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile.component').then(c => c.ProfileComponent),
    title: 'My Profile',
    children: [
      {
        path: '',
        redirectTo: 'addresses',
        pathMatch: 'full'
      },
      {
        path: 'addresses',
        loadComponent: () => import('./features/profile/addresses/addresses.component').then(c => c.AddressesComponent),
        title: 'My Addresses'
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/profile/settings/settings.component').then(c => c.SettingsComponent),
        title: 'Settings'
      }
    ]
  },
  {
    path: 'allorders',
    canActivate: [authGuard],
    loadComponent: () => import('./features/orders/orders.component').then(c => c.OrdersComponent),
    title: 'My Orders'
  },
  {
    path: 'privacy',
    loadComponent: () => import('./features/privacy/privacy.component').then(c => c.PrivacyComponent),
    title: 'Privacy Policy'
  },
  {
    path: 'terms',
    loadComponent: () => import('./features/terms/terms.component').then(c => c.TermsComponent),
    title: 'Terms of Service'
  },
  {
    path: 'cookie',
    loadComponent: () => import('./features/cookie/cookie.component').then(c => c.CookieComponent),
    title: 'Cookie Policy'
  },
  {
    path: 'login',
    canActivate: [loggedGuard],
    loadComponent: () => import('./features/login/login.component').then(c => c.LoginComponent),
    title: 'Login'
  },
  {
    path: 'register',
    canActivate: [loggedGuard],
    loadComponent: () => import('./features/register/register.component').then(c => c.RegisterComponent),
    title: 'Register'
  },
  {
    path: 'forgot',
    canActivate: [loggedGuard],
    loadComponent: () => import('./features/forgot/forgot.component').then(c => c.ForgotComponent),
    title: 'Forgot Password'
  },
  {
    path: 'privacy',
    loadComponent: () => import('./features/privacy/privacy.component').then(c => c.PrivacyComponent),
    title: 'Privacy Policy'
  },
  {
    path: 'terms',
    loadComponent: () => import('./features/terms/terms.component').then(c => c.TermsComponent),
    title: 'Terms and Conditions'
  },

  //! Wrong Path
  {
    path: '**',
    loadComponent: () => import('./features/notfound/notfound.component').then(c => c.NotfoundComponent),
    title: 'Not Found'
  }
];
