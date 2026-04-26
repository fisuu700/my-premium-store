import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <header class="mb-24 relative">
        <div class="absolute -top-20 -left-20 w-64 h-64 bg-hood-gold/10 rounded-full blur-[120px]"></div>
        <div class="absolute top-0 -right-20 w-80 h-80 bg-hood-amber/5 rounded-full blur-[100px]"></div>
        
        <h1 class="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-none">
          THE <span class="marble-text">LAB</span>
        </h1>
        <p class="text-xl text-slate-500 max-w-2xl font-medium leading-relaxed italic border-l-4 border-hood-gold pl-8 py-2">
          Discover the intersection of high-performance hardware and premium craftsmanship. Welcome to the neighborhood.
        </p>
      </header>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        <div *ngFor="let product of products$ | async" 
             class="group glass-card rounded-[2rem] overflow-hidden hover:border-hood-gold/30 transition-all duration-700 cursor-pointer"
             [routerLink]="['/product', product.slug]">
          <div class="aspect-[4/5] overflow-hidden bg-hood-black p-4">
            <img [src]="product.image" [alt]="product.title" 
                 class="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-1000">
          </div>
          <div class="p-8">
            <div class="flex items-center gap-2 mb-4">
               <span class="w-2 h-2 bg-hood-gold rounded-full animate-pulse"></span>
               <span class="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500">In Stock</span>
            </div>
            <h3 class="text-2xl font-black text-white mb-4 tracking-tight group-hover:text-hood-gold transition-colors">{{ product.title }}</h3>
            <div class="flex items-center justify-between mt-auto">
              <span class="text-3xl font-black text-white">{{ product.price }} <span class="text-xs text-hood-gold ml-1">DT</span></span>
              <div class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-hood-gold group-hover:text-black transition-all duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
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
