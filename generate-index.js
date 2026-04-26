const fs = require('fs');
const path = require('path');

const productsDir = path.join(__dirname, 'public/content/products');
const outputFile = path.join(productsDir, 'index.json');

const products = [];

// Lire tous les fichiers du dossier products
fs.readdirSync(productsDir).forEach(file => {
  // Ignorer l'index lui-même et ne prendre que les fichiers .json
  if (file !== 'index.json' && file.endsWith('.json')) {
    const filePath = path.join(productsDir, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    products.push({
      slug: file.replace('.json', ''),
      title: content.title,
      price: content.price,
      image: content.image
    });
  }
});

// Écrire la nouvelle liste dans index.json
fs.writeFileSync(outputFile, JSON.stringify(products, null, 2));
console.log(`Successfully generated index.json with ${products.length} products.`);
