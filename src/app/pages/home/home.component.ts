import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header class="mb-12 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Premium Collection</h1>
        <p class="text-lg text-slate-600 max-w-2xl mx-auto font-light">
          Discover our curated selection of high-quality products designed for the modern lifestyle.
        </p>
      </header>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div *ngFor="let product of products$ | async" 
             class="group glass-card rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-500 cursor-pointer"
             [routerLink]="['/product', product.slug]">
          <div class="aspect-square overflow-hidden bg-slate-100">
            <img [src]="product.image" [alt]="product.title" 
                 class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
          </div>
          <div class="p-6">
            <h3 class="text-xl font-semibold text-slate-800 mb-2">{{ product.title }}</h3>
            <div class="flex items-center justify-between">
              <span class="text-2xl font-bold text-indigo-600">{{ product.price }} DT</span>
              <span class="text-sm font-medium text-slate-400 group-hover:text-indigo-500 transition-colors">View Details →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class HomeComponent {
  private productService = inject(ProductService);
  products$ = this.productService.getProducts();
}
