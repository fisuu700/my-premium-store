import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div class="flex items-center gap-2 cursor-pointer" routerLink="/">
          <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <span class="text-white font-bold text-xl">S</span>
          </div>
          <span class="text-2xl font-bold tracking-tight text-slate-900">STORE<span class="text-indigo-600">FRONT</span></span>
        </div>
        
        <div class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 uppercase tracking-widest">
          <a routerLink="/" class="hover:text-indigo-600 transition-colors">Collection</a>
          <a href="#" class="hover:text-indigo-600 transition-colors">About</a>
          <a href="#" class="hover:text-indigo-600 transition-colors">Contact</a>
        </div>

        <button class="p-2 text-slate-600 hover:text-indigo-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </button>
      </nav>
    </header>

    <main class="min-h-screen bg-slate-50 pt-8 pb-20">
      <router-outlet></router-outlet>
    </main>

    <footer class="bg-slate-900 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-slate-800 pb-12">
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center gap-2 mb-6">
              <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-lg">S</span>
              </div>
              <span class="text-xl font-bold tracking-tight">STOREFRONT</span>
            </div>
            <p class="text-slate-400 max-w-sm font-light leading-relaxed">
              Premium curated goods for the discerning individual. Quality-first, minimalist by design.
            </p>
          </div>
          <div>
            <h4 class="font-bold mb-6 text-indigo-400">Shop</h4>
            <ul class="space-y-4 text-slate-400 text-sm">
              <li><a href="#" class="hover:text-white transition-colors">New Arrivals</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Best Sellers</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Gift Cards</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold mb-6 text-indigo-400">Support</h4>
            <ul class="space-y-4 text-slate-400 text-sm">
              <li><a href="#" class="hover:text-white transition-colors">Shipping Policy</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Return & Exchange</a></li>
              <li><a href="#" class="hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>
        </div>
        <div class="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500">
          <p>&copy; 2026 Storefront Inc. All rights reserved.</p>
          <div class="flex gap-8">
            <a href="#" class="hover:text-white">Privacy</a>
            <a href="#" class="hover:text-white">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class AppComponent {
  title = 'storefront';
}
