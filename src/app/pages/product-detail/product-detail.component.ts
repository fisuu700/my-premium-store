import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" *ngIf="product$ | async as product">
      <nav class="mb-16">
        <a routerLink="/" class="text-hood-gold font-bold uppercase tracking-[0.2em] text-xs hover:text-white flex items-center gap-3 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Return to Lab
        </a>
      </nav>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
        <div class="rounded-[2.5rem] overflow-hidden glass-card p-4 relative group">
          <div class="absolute top-8 right-8 z-10">
            <div class="bg-hood-gold text-black text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl">Premium</div>
          </div>
          <img [src]="product.image" [alt]="product.title" class="w-full h-auto object-cover rounded-[2rem] group-hover:scale-[1.02] transition-transform duration-700">
        </div>

        <div class="flex flex-col h-full pt-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-1.5 h-10 bg-hood-gold rounded-full"></div>
            <h1 class="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">{{ product.title }}</h1>
          </div>
          
          <p class="text-4xl font-black text-hood-gold mb-10">{{ product.price }} <span class="text-sm ml-1 text-slate-500 uppercase tracking-widest">Tunisian Dinars</span></p>
          
          <div class="prose prose-invert max-w-none mb-16">
            <p class="text-xl text-slate-400 leading-relaxed font-medium italic">
              "{{ product.description }}"
            </p>
          </div>

          <div class="mt-auto space-y-6">
            <a [href]="getWhatsAppLink(product)" 
               target="_blank"
               class="btn-whatsapp w-full py-5 text-xl tracking-tighter flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg>
              Secure Order via WhatsApp
            </a>
            <p class="text-[10px] text-center text-slate-600 uppercase tracking-[0.4em] font-black">
              Direct from THE HOOD • Worldwide Warranty
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ProductDetailComponent implements OnInit {
  @Input() slug!: string;
  private productService = inject(ProductService);
  product$!: Observable<Product>;

  ngOnInit() {
    this.product$ = this.productService.getProductBySlug(this.slug);
  }

  getWhatsAppLink(product: Product): string {
    const phoneNumber = '21699000000'; // Placeholder, user should update
    const message = `Hello, I want to order ${product.title} for ${product.price} DT. ${window.location.href}`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  }
}
