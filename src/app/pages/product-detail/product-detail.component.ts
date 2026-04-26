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
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" *ngIf="product$ | async as product">
      <nav class="mb-8">
        <a routerLink="/" class="text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-2">
          ← Back to Collection
        </a>
      </nav>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div class="rounded-3xl overflow-hidden glass-card">
          <img [src]="product.image" [alt]="product.title" class="w-full h-auto object-cover">
        </div>

        <div class="flex flex-col h-full">
          <h1 class="text-4xl font-bold text-slate-900 mb-4">{{ product.title }}</h1>
          <p class="text-3xl font-bold text-indigo-600 mb-8">{{ product.price }} DT</p>
          
          <div class="prose prose-slate max-w-none mb-12">
            <p class="text-lg text-slate-600 leading-relaxed">
              {{ product.description }}
            </p>
          </div>

          <div class="mt-auto">
            <a [href]="getWhatsAppLink(product)" 
               target="_blank"
               class="btn-whatsapp w-full md:w-auto py-4 text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg>
              Order via WhatsApp
            </a>
            <p class="mt-4 text-sm text-center md:text-left text-slate-400">
              Direct checkout. No account required.
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
