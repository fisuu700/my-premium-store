import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="bg-hood-black/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
        <div class="flex items-center gap-3 cursor-pointer" routerLink="/">
          <div class="w-12 h-12 bg-gradient-to-br from-hood-amber to-hood-gold rounded-full flex items-center justify-center shadow-lg shadow-hood-amber/30 group">
            <span class="text-black font-black text-2xl group-hover:scale-110 transition-transform">H</span>
          </div>
          <div class="flex flex-col leading-tight">
            <span class="text-2xl font-black tracking-tighter text-white">THE <span class="marble-text uppercase">HOOD</span></span>
            <span class="text-[10px] uppercase tracking-[0.3em] text-hood-gold font-bold">Vape & Phone Store</span>
          </div>
        </div>
        
        <div class="hidden md:flex items-center gap-10 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
          <a routerLink="/" class="hover:text-hood-gold transition-colors">The Lab</a>
          <a href="#" class="hover:text-hood-gold transition-colors">Our Ethos</a>
          <a href="#" class="hover:text-hood-gold transition-colors">Connect</a>
        </div>

        <button class="p-3 bg-white/5 rounded-full text-hood-gold hover:bg-hood-gold hover:text-black transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </button>
      </nav>
    </header>

    <main class="min-h-screen bg-marble pb-24">
      <router-outlet></router-outlet>
    </main>

    <footer class="bg-black text-white py-20 border-t border-white/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16 border-b border-white/5 pb-16">
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center gap-3 mb-8">
              <div class="w-10 h-10 bg-hood-gold rounded-full flex items-center justify-center">
                <span class="text-black font-bold text-xl">H</span>
              </div>
              <span class="text-2xl font-black tracking-tighter">THE HOOD</span>
            </div>
            <p class="text-slate-500 max-w-sm font-medium leading-relaxed italic">
              "Excellence in every cloud. Precision in every device."
            </p>
            <div class="flex gap-4 mt-8">
              <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:text-hood-gold cursor-pointer transition-colors border border-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </div>
              <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:text-hood-gold cursor-pointer transition-colors border border-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </div>
            </div>
          </div>
          <div>
            <h4 class="text-xs uppercase tracking-[0.3em] font-black mb-8 text-hood-gold">Gear</h4>
            <ul class="space-y-4 text-slate-400 text-sm font-bold">
              <li><a href="#" class="hover:text-white transition-colors">Vape Kits</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Premium E-Liquids</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Latest Smartphones</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-xs uppercase tracking-[0.3em] font-black mb-8 text-hood-gold">HQ</h4>
            <ul class="space-y-4 text-slate-400 text-sm font-bold">
              <li><span class="text-white">Sidi Bouzid</span></li>
              <li><span class="text-slate-500">Tunisia</span></li>
            </ul>
          </div>
        </div>
        <div class="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-widest text-slate-600 font-bold">
          <p>&copy; 2026 THE HOOD. Crafted for the Bold.</p>
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
