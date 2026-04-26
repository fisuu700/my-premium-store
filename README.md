# Premium Angular Storefront

A professional, high-end E-commerce storefront built with Angular 18 and Tailwind CSS, managed via Decap CMS.

## Features
- **Fully Static**: Jamstack architecture for maximum performance.
- **Decap CMS**: Manage products via a user-friendly admin interface.
- **WhatsApp Checkout**: Direct purchase link for seamless transactions.
- **Netlify Identity**: Integrated authentication for content management.
- **Premium Design**: Modern, minimalist aesthetic with glassmorphism.

## Getting Started

### Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm start
   ```
3. Open `http://localhost:4200` in your browser.

### Managing Products
- Access the CMS at `http://localhost:4200/admin/`.
- To use the CMS locally, you may need a local proxy or use the Netlify Identity widget in a deployed environment.
- Products are stored in `public/content/products/` as JSON files.
- Remember to update `public/content/products/index.json` when adding new products manually, or configure a build script to generate it automatically.

### Configuration
- **WhatsApp Number**: Update the phone number in `src/app/pages/product-detail/product-detail.component.ts`.
- **Decap CMS**: Modify `public/admin/config.yml` for different fields or collections.

## Deployment
This site is designed to be deployed on **Netlify**.
1. Connect your repository to Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist/storefront/browser` (Note: Angular 18 might output to `browser` subfolder).
4. Enable **Netlify Identity** and **Git Gateway** in the Netlify dashboard.
