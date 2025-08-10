import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'section',
    loadChildren: () => import('./pages/section/section.module').then(m => m.SectionPageModule)
  },
  {
    path: 'order/:id',
    loadChildren: () => import('./pages/order/order.module').then(m => m.OrderPageModule)
  },
  {
    path: 'offer',
    loadChildren: () => import('./pages/offer/offer.module').then(m => m.OfferPageModule)
  },
  {
    path: 'product/:id',
    loadChildren: () => import('./pages/product/product.module').then(m => m.ProductPageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./pages/cart/cart.module').then(m => m.CartPageModule)
  }, {
    path: 'brands-sections',
    loadChildren: () => import('./pages/brands-sections/brands-sections.module').then(m => m.BrandsSectionsPageModule)
  },
  {
    path: 'branchs',
    loadChildren: () => import('./pages/branchs/branchs.module').then(m => m.BranchsPageModule)
  },
  {
    path: 'custom-image',
    loadChildren: () => import('./pages/custom-image/custom-image.module').then(m => m.CustomImagePageModule)
  },
  {
    path: 'search-products',
    loadChildren: () => import('./pages/search-products/search-products.module').then(m => m.SearchProductsPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./pages/notifications/notifications.module').then(m => m.NotificationsPageModule)
  },
  {
    path: 'brand',
    loadChildren: () => import('./pages/brand/brand.module').then(m => m.BrandPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
