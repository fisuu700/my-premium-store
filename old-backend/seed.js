/**
 * Script de seed pour initialiser la base de données avec des données de test
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Admin = require('./models/Admin');

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connecté à MongoDB');

    // Vider les collections existantes
    await Product.deleteMany({});
    await Admin.deleteMany({});
    console.log('🗑️  Collections vidées');

    // Créer un administrateur par défaut
    const adminData = {
      username: 'admin',
      email: 'admin@boutique.com',
      password: 'admin123',
      role: 'super_admin'
    };

    const admin = await Admin.create(adminData);
    console.log('✅ Administrateur créé:', admin.username);

    // Données de produits d'exemple
    const productsData = [
      {
        nom: 'Laptop Pro 15"',
        description: 'Ordinateur portable haute performance avec processeur dernière génération, 16GB RAM, SSD 512GB',
        prix: 1299.99,
        imageURL: 'https://via.placeholder.com/400x300?text=Laptop+Pro',
        stock: 25,
        categorie: 'Électronique'
      },
      {
        nom: 'Smartphone XYZ',
        description: 'Téléphone mobile dernier cri avec écran AMOLED, 5G, caméra 108MP',
        prix: 899.99,
        imageURL: 'https://via.placeholder.com/400x300?text=Smartphone+XYZ',
        stock: 50,
        categorie: 'Électronique'
      },
      {
        nom: 'Casque Audio Bluetooth',
        description: 'Casque sans fil avec réduction de bruit active, autonomie 40h',
        prix: 199.99,
        imageURL: 'https://via.placeholder.com/400x300?text=Casque+Audio',
        stock: 100,
        categorie: 'Audio'
      },
      {
        nom: 'Montre Connectée',
        description: 'Montre intelligente avec moniteur cardiaque, GPS, étanche jusqu\'à 50m',
        prix: 299.99,
        imageURL: 'https://via.placeholder.com/400x300?text=Montre+Connectee',
        stock: 75,
        categorie: 'Wearables'
      },
      {
        nom: 'Tablette 10 pouces',
        description: 'Tablette Android avec écran haute résolution, batterie 8000mAh',
        prix: 399.99,
        imageURL: 'https://via.placeholder.com/400x300?text=Tablette',
        stock: 40,
        categorie: 'Électronique'
      },
      {
        nom: 'Clavier Mécanique RGB',
        description: 'Clavier gaming avec switches mécaniques, rétroéclairage RGB programmable',
        prix: 149.99,
        imageURL: 'https://via.placeholder.com/400x300?text=Clavier+Mecanique',
        stock: 60,
        categorie: 'Accessoires'
      },
      {
        nom: 'Souris Gamer Logitech',
        description: 'Souris sans fil ultra-précise, 8 boutons programmables, 25600 DPI',
        prix: 79.99,
        imageURL: 'https://via.placeholder.com/400x300?text=Souris+Gamer',
        stock: 120,
        categorie: 'Accessoires'
      },
      {
        nom: 'Batterie Externe 20000mAh',
        description: 'Chargeur portable haute capacité avec double USB-C, charge rapide 65W',
        prix: 49.99,
        imageURL: 'https://via.placeholder.com/400x300?text=Batterie+Externe',
        stock: 200,
        categorie: 'Accessoires'
      }
    ];

    // Créer les produits
    const products = await Product.insertMany(productsData);
    console.log(`✅ ${products.length} produits créés`);

    // Afficher un résumé
    console.log('\n📊 Résumé des données créées:');
    console.log(`   - Administrateurs: 1`);
    console.log(`   - Produits: ${products.length}`);
    console.log(`   - Stock total: ${products.reduce((sum, p) => sum + p.stock, 0)} unités`);

    console.log('\n🎉 Database seeding terminé avec succès!\n');

    // Afficher les identifiants
    console.log('🔐 Identifiants de test:');
    console.log(`   Username: ${adminData.username}`);
    console.log(`   Password: ${adminData.password}`);
    console.log(`   Email: ${adminData.email}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error.message);
    process.exit(1);
  }
};

seedDatabase();
