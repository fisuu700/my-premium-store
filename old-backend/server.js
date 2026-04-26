const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement
dotenv.config();

// Importer les routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');
const advancedProductRoutes = require('./routes/advancedProductRoutes');

// Importer les middleware personnalisés
const { rateLimiter, userRateLimiter } = require('./middleware/rateLimiter');
const corsMiddleware = require('./middleware/corsMiddleware');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

// ==================== Middleware ====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Advanced CORS middleware
app.use(corsMiddleware);

// Advanced rate limiting middleware (par IP)
app.use(rateLimiter);

// ==================== Connexion MongoDB ====================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connexion MongoDB établie avec succès');
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    process.exit(1);
  }
};

connectDB();

// ==================== Routes ====================

// Route de santé
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Serveur fonctionnant correctement',
    timestamp: new Date()
  });
});

// Route to serve admin dashboard
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin/dashboard.html'));
});

// Routes d'authentification
// Routes d'authentification
app.use('/api/auth', authRoutes);

// Routes des produits
app.use('/api/products', productRoutes);
app.use('/api/products', advancedProductRoutes);

// Routes des administrateurs (avec rate limiting par utilisateur)
app.use('/api/admin', authMiddleware, userRateLimiter, adminRoutes);

// ==================== Gestion des erreurs ====================

// Route non trouvée
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    path: req.path
  });
});

// Middleware de gestion des erreurs global
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  
  res.status(500).json({
    success: false,
    message: 'Erreur serveur interne',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});

// ==================== Démarrage du serveur ====================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║  🚀 Serveur de boutique en ligne démarré           ║
║  📍 Port: ${PORT}                                  ║
║  🔐 JWT activé pour routes admin                   ║
║  📱 API Facebook Graph configurée                  ║
║  💾 MongoDB connecté                               ║
╚════════════════════════════════════════════════════╝

    📚 Points d'accès disponibles:
    • GET    /admin                     (Dashboard admin)
    • GET    /api/health                (Santé du serveur)
    • POST   /api/auth/login            (Obtenir un token JWT)
    • GET    /api/products              (Lister tous les produits)
    • GET    /api/products/:id          (Détails d'un produit)
    • POST   /api/products              (Créer un produit - Admin)
    • PUT    /api/products/:id          (Modifier un produit - Admin)
    • DELETE /api/products/:id          (Supprimer un produit - Admin)
    • POST   /api/admin/register        (Créer un admin - Protégé)
    • GET    /api/admin/me              (Profil admin - Protégé)
    • GET    /api/admin/list            (Liste admins - Protégé)
    • PUT    /api/admin/:id             (Modifier admin - Protégé)
    • DELETE /api/admin/:id             (Supprimer admin - Protégé)
    • GET    /api/admin/products        (Lister tous les produits - Admin)
    • GET    /api/admin/products/:id    (Détails d'un produit - Admin)
    • POST   /api/admin/products        (Créer un produit - Admin)
    • PUT    /api/admin/products/:id    (Modifier un produit - Admin)
    • DELETE /api/admin/products/:id    (Supprimer un produit - Admin)

🔐 Routes admin nécessitent:
  Header: Authorization: Bearer <TOKEN_JWT>

📖 Guide d'utilisation:
  1. Authentifiez-vous: POST /api/auth/login
  2. Copiez le token reçu
  3. Utilisez-le dans le header Authorization pour les routes admin
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu, arrêt du serveur...');
  server.close(() => {
    console.log('Serveur fermé');
    mongoose.connection.close();
  });
});

module.exports = app;
