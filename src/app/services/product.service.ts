import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Product {
  slug?: string;
  title: string;
  price: number;
  image: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private productsUrl = 'content/products';

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.productsUrl}/index.json`);
  }

  getProductBySlug(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.productsUrl}/${slug}.json`).pipe(
      map(product => ({ ...product, slug }))
    );
  }
}
