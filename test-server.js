/**
 * Serveur de test simplifié sans dépendances externes
 * Pour tester les endpoints rapidement
 */

const http = require('http');
const url = require('url');

// Configuration
const PORT = 5001;

// Rate Limiting implementation for test server
const rateLimits = new Map();

const defaultRateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard'
};

const routeRateLimits = {
  '/api/auth/login': {
    windowMs: 15 * 60 * 1000,
    max: 10, // Limite stricte pour les tentatives de login
    message: 'Trop de tentatives de connexion, veuillez réessayer dans 15 minutes'
  },
  '/api/auth/register': {
    windowMs: 60 * 60 * 1000,
    max: 5, // Limite très stricte pour l'inscription
    message: 'Trop d\'inscriptions depuis cette IP, veuillez réessayer dans 1 heure'
  },
  '/api/admin': {
    windowMs: 15 * 60 * 1000,
    max: 50, // Limite moins stricte pour les routes admin
    message: 'Trop de requêtes admin depuis cette IP, veuillez réessayer dans 15 minutes'
  },
  '/api/products/search': {
    windowMs: 15 * 60 * 1000,
    max: 60, // Limite pour la recherche avancée
    message: 'Trop de recherches depuis cette IP, veuillez réessayer dans 15 minutes'
  },
  '/api/products/stats': {
    windowMs: 30 * 60 * 1000,
    max: 20, // Limite stricte pour les statistiques
    message: 'Trop de requêtes de statistiques depuis cette IP, veuillez réessayer dans 30 minutes'
  },
  '/api/products/bulk': {
    windowMs: 60 * 60 * 1000,
    max: 10, // Limite très stricte pour les opérations en masse
    message: 'Trop d\'opérations en masse depuis cette IP, veuillez réessayer dans 1 heure'
  },
  '/api/products': {
    windowMs: 15 * 60 * 1000,
    max: 80, // Limite pour les routes de produits
    message: 'Trop de requêtes sur les produits depuis cette IP, veuillez réessayer dans 15 minutes'
  }
};

const getRateLimitConfig = (path) => {
  for (const [routePattern, config] of Object.entries(routeRateLimits)) {
    if (path.startsWith(routePattern)) {
      return config;
    }
  }
  return defaultRateLimit;
};

const rateLimiter = (req, res, next) => {
  const ip = req.connection.remoteAddress;
  const config = getRateLimitConfig(req.url);
  const key = `${ip}:${req.method}:${req.url}`;
  
  const now = Date.now();
  
  if (!rateLimits.has(key)) {
    rateLimits.set(key, {
      requests: [],
      windowStart: now,
      windowEnd: now + config.windowMs
    });
  }
  
  const rateLimitData = rateLimits.get(key);
  
  if (now > rateLimitData.windowEnd) {
    rateLimitData.requests = [];
    rateLimitData.windowStart = now;
    rateLimitData.windowEnd = now + config.windowMs;
  }
  
  rateLimitData.requests.push(now);
  
  rateLimitData.requests = rateLimitData.requests.filter(timestamp => 
    timestamp > rateLimitData.windowEnd - config.windowMs
  );
  
  if (rateLimitData.requests.length > config.max) {
    const retryAfter = Math.ceil((rateLimitData.windowEnd - now) / 1000);
    
    res.setHeader('X-RateLimit-Limit', config.max);
    res.setHeader('X-RateLimit-Remaining', 0);
    res.setHeader('X-RateLimit-Reset', rateLimitData.windowEnd);
    res.setHeader('Retry-After', retryAfter);
    
    res.writeHead(429);
    res.end(JSON.stringify({
      success: false,
      error: config.message,
      retryAfter: retryAfter,
      resetTime: new Date(rateLimitData.windowEnd),
      code: 'RATE_LIMIT_EXCEEDED',
      limit: config.max,
      window: `${Math.floor(config.windowMs / 1000 / 60)} minutes`
    }));
    return;
  }
  
  res.setHeader('X-RateLimit-Limit', config.max);
  res.setHeader('X-RateLimit-Remaining', config.max - rateLimitData.requests.length);
  res.setHeader('X-RateLimit-Reset', rateLimitData.windowEnd);
  
  if (Math.random() < 0.01) {
    for (const [key, data] of rateLimits.entries()) {
      if (now > data.windowEnd) {
        rateLimits.delete(key);
      }
    }
  }
  
  next();
};

// Données en mémoire (remplacera MongoDB pour les tests)
let products = [
  {
    _id: '1',
    nom: 'Laptop Pro 15"',
    description: 'Ordinateur portable haute performance avec processeur dernière génération, 16GB RAM, SSD 512GB',
    prix: 1299.99,
    imageURL: 'https://via.placeholder.com/400x300?text=Laptop+Pro',
    stock: 25,
    categorie: 'Électronique',
    createdAt: new Date()
  },
  {
    _id: '2',
    nom: 'Smartphone XYZ',
    description: 'Téléphone mobile dernier cri avec écran AMOLED, 5G, caméra 108MP',
    prix: 899.99,
    imageURL: 'https://via.placeholder.com/400x300?text=Smartphone+XYZ',
    stock: 50,
    categorie: 'Électronique',
    createdAt: new Date()
  },
  {
    _id: '3',
    nom: 'Casque Audio Bluetooth',
    description: 'Casque sans fil avec réduction de bruit active, autonomie 40h',
    prix: 199.99,
    imageURL: 'https://via.placeholder.com/400x300?text=Casque+Audio',
    stock: 100,
    categorie: 'Audio',
    createdAt: new Date()
  },
  {
    _id: '4',
    nom: 'Montre Connectée',
    description: 'Montre intelligente avec moniteur cardiaque, GPS, étanche jusqu\'à 50m',
    prix: 299.99,
    imageURL: 'https://via.placeholder.com/400x300?text=Montre+Connectee',
    stock: 75,
    categorie: 'Wearables',
    createdAt: new Date()
  },
  {
    _id: '5',
    nom: 'Tablette 10 pouces',
    description: 'Tablette Android avec écran haute résolution, batterie 8000mAh',
    prix: 399.99,
    imageURL: 'https://via.placeholder.com/400x300?text=Tablette',
    stock: 40,
    categorie: 'Électronique',
    createdAt: new Date()
  },
  {
    _id: '6',
    nom: 'Clavier Mécanique RGB',
    description: 'Clavier gaming avec switches mécaniques, rétroéclairage RGB programmable',
    prix: 149.99,
    imageURL: 'https://via.placeholder.com/400x300?text=Clavier+Mecanique',
    stock: 60,
    categorie: 'Accessoires',
    createdAt: new Date()
  },
  {
    _id: '7',
    nom: 'Souris Gamer Logitech',
    description: 'Souris sans fil ultra-précise, 8 boutons programmables, 25600 DPI',
    prix: 79.99,
    imageURL: 'https://via.placeholder.com/400x300?text=Souris+Gamer',
    stock: 120,
    categorie: 'Accessoires',
    createdAt: new Date()
  },
  {
    _id: '8',
    nom: 'Batterie Externe 20000mAh',
    description: 'Chargeur portable haute capacité avec double USB-C, charge rapide 65W',
    prix: 49.99,
    imageURL: 'https://via.placeholder.com/400x300?text=Batterie+Externe',
    stock: 200,
    categorie: 'Accessoires',
    createdAt: new Date()
  }
];

let tokenValid = false;
let adminToken = null;

// Parser de body JSON
const parseBody = async (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
};

// Créer le serveur
const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    return res.writeHead(200).end();
  }

  // Apply rate limiting
  await new Promise((resolve, reject) => {
    rateLimiter(req, res, resolve);
  });
  
   const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Serve admin dashboard
  if (pathname === '/admin' && req.method === 'GET') {
    const fs = require('fs');
    const path = require('path');
    const dashboardPath = path.join(__dirname, 'public/admin/dashboard.html');
    if (fs.existsSync(dashboardPath)) {
      const content = fs.readFileSync(dashboardPath, 'utf8');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.writeHead(200);
      res.end(content);
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({
        success: false,
        message: 'Dashboard not found'
      }));
    }
    return;
  }

  // Serve admin static files
  if (pathname.startsWith('/admin/') && req.method === 'GET') {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, 'public', pathname);
    
    console.log('Tentative de lecture du fichier:', filePath);
    
    if (fs.existsSync(filePath)) {
      try {
        const data = fs.readFileSync(filePath);
        const ext = path.extname(filePath);
        const contentType = ext === '.html' ? 'text/html' : 
                            ext === '.css' ? 'text/css' : 
                            ext === '.js' ? 'application/javascript' : 'text/plain';
                            
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
        return;
      } catch (err) {
        console.error('Erreur de lecture:', err);
        res.writeHead(500);
        res.end(JSON.stringify({
          success: false,
          message: 'Erreur lors de la lecture du fichier'
        }));
        return;
      }
    } else {
      console.log('Fichier non trouvé:', filePath);
    }
  }

  // Routes
  try {
    // Health check
    if (pathname === '/api/health' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        message: 'Serveur fonctionnant correctement',
        timestamp: new Date()
      }));
      return;
    }

    // Login (obtenir token)
    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const body = await parseBody(req);
      if (body.username === 'admin' && body.password === 'admin123') {
        adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluIiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3NDk0NDAwMH0.test_token_' + Math.random();
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          message: 'Authentification réussie',
          token: adminToken,
          expiresIn: '24h'
        }));
      } else {
        res.writeHead(401);
        res.end(JSON.stringify({
          success: false,
          message: 'Identifiants invalides'
        }));
      }
      return;
    }

    // Lister tous les produits
    if (pathname === '/api/products' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        count: products.length,
        data: products
      }));
      return;
    }

    // Récupérer un produit
    const productMatch = pathname.match(/^\/api\/products\/(.+)$/);
    if (productMatch && req.method === 'GET') {
      const product = products.find(p => p._id === productMatch[1]);
      if (product) {
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          data: product
        }));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({
          success: false,
          message: 'Produit non trouvé'
        }));
      }
      return;
    }

    // Créer un produit (protégé)
    if (pathname === '/api/products' && req.method === 'POST') {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.writeHead(401);
        res.end(JSON.stringify({
          success: false,
          message: 'Accès refusé. Token manquant.'
        }));
        return;
      }

      const body = await parseBody(req);
      if (!body.nom || !body.description || !body.prix || !body.imageURL) {
        res.writeHead(400);
        res.end(JSON.stringify({
          success: false,
          message: 'Tous les champs requis doivent être fournis'
        }));
        return;
      }

      const newProduct = {
        _id: Math.random().toString(),
        nom: body.nom,
        description: body.description,
        prix: body.prix,
        imageURL: body.imageURL,
        stock: body.stock || 0,
        categorie: body.categorie || 'Général',
        createdAt: new Date()
      };

      products.push(newProduct);
      res.writeHead(201);
      res.end(JSON.stringify({
        success: true,
        message: 'Produit créé avec succès',
        data: newProduct,
        facebook: {
          success: true,
          message: 'Publication simulée sur Facebook'
        }
      }));
      return;
    }

    // Modifier un produit (protégé)
    if (productMatch && req.method === 'PUT') {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.writeHead(401);
        res.end(JSON.stringify({
          success: false,
          message: 'Accès refusé. Token manquant.'
        }));
        return;
      }

      const body = await parseBody(req);
      const product = products.find(p => p._id === productMatch[1]);
      if (!product) {
        res.writeHead(404);
        res.end(JSON.stringify({
          success: false,
          message: 'Produit non trouvé'
        }));
        return;
      }

      Object.assign(product, body);
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        message: 'Produit modifié avec succès',
        data: product
      }));
      return;
    }

     // Routes de sécurité (admin)
     // Change password
     if (pathname === '/api/admin/change-password' && req.method === 'POST') {
       const authHeader = req.headers.authorization;
       if (!authHeader || !authHeader.startsWith('Bearer ')) {
         res.writeHead(401);
         res.end(JSON.stringify({
           success: false,
           message: 'Accès refusé. Token manquant.'
         }));
         return;
       }

       const body = await parseBody(req);
       if (!body.currentPassword || !body.newPassword) {
         res.writeHead(400);
         res.end(JSON.stringify({
           success: false,
           message: 'Le mot de passe actuel et le nouveau mot de passe sont requis'
         }));
         return;
       }

       if (body.newPassword.length < 6) {
         res.writeHead(400);
         res.end(JSON.stringify({
           success: false,
           message: 'Le nouveau mot de passe doit contenir au moins 6 caractères'
         }));
         return;
       }

       if (body.currentPassword !== 'admin123') {
         res.writeHead(401);
         res.end(JSON.stringify({
           success: false,
           message: 'Le mot de passe actuel est incorrect'
         }));
         return;
       }

       res.writeHead(200);
       res.end(JSON.stringify({
         success: true,
         message: 'Mot de passe changé avec succès'
       }));
       return;
     }

     // Change username
     if (pathname === '/api/admin/change-username' && req.method === 'PUT') {
       const authHeader = req.headers.authorization;
       if (!authHeader || !authHeader.startsWith('Bearer ')) {
         res.writeHead(401);
         res.end(JSON.stringify({
           success: false,
           message: 'Accès refusé. Token manquant.'
         }));
         return;
       }

       const body = await parseBody(req);
       if (!body.newUsername || !body.currentPassword) {
         res.writeHead(400);
         res.end(JSON.stringify({
           success: false,
           message: 'Le nouveau nom d\'utilisateur et le mot de passe actuel sont requis'
         }));
         return;
       }

       if (body.newUsername.length < 3) {
         res.writeHead(400);
         res.end(JSON.stringify({
           success: false,
           message: 'Le nouveau nom d\'utilisateur doit contenir au moins 3 caractères'
         }));
         return;
       }

       if (body.currentPassword !== 'admin123') {
         res.writeHead(401);
         res.end(JSON.stringify({
           success: false,
           message: 'Le mot de passe actuel est incorrect'
         }));
         return;
       }

       res.writeHead(200);
       res.end(JSON.stringify({
         success: true,
         message: 'Nom d\'utilisateur changé avec succès',
         data: {
           id: 'admin',
           username: body.newUsername,
           email: 'admin@example.com',
           role: 'admin'
         }
       }));
       return;
     }

     // Routes d'administration des produits
     // Lister tous les produits (admin)
     if (pathname === '/api/admin/products' && req.method === 'GET') {
       const authHeader = req.headers.authorization;
       if (!authHeader || !authHeader.startsWith('Bearer ')) {
         res.writeHead(401);
         res.end(JSON.stringify({
           success: false,
           message: 'Accès refusé. Token manquant.'
         }));
         return;
       }

       res.writeHead(200);
       res.end(JSON.stringify({
         success: true,
         count: products.length,
         data: products
       }));
       return;
     }

     // Récupérer un produit (admin)
     const adminProductMatch = pathname.match(/^\/api\/admin\/products\/(.+)$/);
     if (adminProductMatch && req.method === 'GET') {
       const authHeader = req.headers.authorization;
       if (!authHeader || !authHeader.startsWith('Bearer ')) {
         res.writeHead(401);
         res.end(JSON.stringify({
           success: false,
           message: 'Accès refusé. Token manquant.'
         }));
         return;
       }

       const product = products.find(p => p._id === adminProductMatch[1]);
       if (product) {
         res.writeHead(200);
         res.end(JSON.stringify({
           success: true,
           data: product
         }));
       } else {
         res.writeHead(404);
         res.end(JSON.stringify({
           success: false,
           message: 'Produit non trouvé'
         }));
       }
       return;
     }

     // Créer un produit (admin)
     if (pathname === '/api/admin/products' && req.method === 'POST') {
       const authHeader = req.headers.authorization;
       if (!authHeader || !authHeader.startsWith('Bearer ')) {
         res.writeHead(401);
         res.end(JSON.stringify({
           success: false,
           message: 'Accès refusé. Token manquant.'
         }));
         return;
       }

       const body = await parseBody(req);
       if (!body.nom || !body.description || !body.prix || !body.imageURL) {
         res.writeHead(400);
         res.end(JSON.stringify({
           success: false,
           message: 'Tous les champs requis doivent être fournis'
         }));
         return;
       }

       const newProduct = {
         _id: Math.random().toString(),
         nom: body.nom,
         description: body.description,
         prix: body.prix,
         imageURL: body.imageURL,
         stock: body.stock || 0,
         categorie: body.categorie || 'Général',
         createdAt: new Date()
       };

       products.push(newProduct);
       res.writeHead(201);
       res.end(JSON.stringify({
         success: true,
         message: 'Produit créé avec succès',
         data: newProduct
       }));
       return;
     }

     // Modifier un produit (admin)
     if (adminProductMatch && req.method === 'PUT') {
       const authHeader = req.headers.authorization;
       if (!authHeader || !authHeader.startsWith('Bearer ')) {
         res.writeHead(401);
         res.end(JSON.stringify({
           success: false,
           message: 'Accès refusé. Token manquant.'
         }));
         return;
       }

       const body = await parseBody(req);
       const product = products.find(p => p._id === adminProductMatch[1]);
       if (!product) {
         res.writeHead(404);
         res.end(JSON.stringify({
           success: false,
           message: 'Produit non trouvé'
         }));
         return;
       }

       Object.assign(product, body);
       res.writeHead(200);
       res.end(JSON.stringify({
         success: true,
         message: 'Produit modifié avec succès',
         data: product
       }));
       return;
     }

      // Lister tous les administrateurs (admin)
      if (pathname === '/api/admin/list' && req.method === 'GET') {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          res.writeHead(401);
          res.end(JSON.stringify({
            success: false,
            message: 'Accès refusé. Token manquant.'
          }));
          return;
        }

        const admins = [
          { _id: '1', username: 'admin', email: 'admin@boutique.com', role: 'super_admin', isActive: true }
        ];

        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          count: admins.length,
          data: admins
        }));
        return;
      }

      // Récupérer les informations de l'admin connecté (admin)
      if (pathname === '/api/admin/me' && req.method === 'GET') {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          res.writeHead(401);
          res.end(JSON.stringify({
            success: false,
            message: 'Accès refusé. Token manquant.'
          }));
          return;
        }

        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          data: { _id: '1', username: 'admin', email: 'admin@boutique.com', role: 'super_admin', isActive: true }
        }));
        return;
      }

      // Créer un nouvel administrateur (admin)
      if (pathname === '/api/admin/register' && req.method === 'POST') {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          res.writeHead(401);
          res.end(JSON.stringify({
            success: false,
            message: 'Accès refusé. Token manquant.'
          }));
          return;
        }

        const body = await parseBody(req);
        if (!body.username || !body.email || !body.password) {
          res.writeHead(400);
          res.end(JSON.stringify({
            success: false,
            message: 'Username, email et password sont requis'
          }));
          return;
        }

        const newAdmin = {
          _id: Math.random().toString(),
          username: body.username,
          email: body.email,
          role: body.role || 'admin',
          isActive: true
        };

        res.writeHead(201);
        res.end(JSON.stringify({
          success: true,
          message: 'Administrateur créé avec succès',
          data: newAdmin
        }));
        return;
      }

      // Supprimer un produit (admin)
      if (adminProductMatch && req.method === 'DELETE') {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          res.writeHead(401);
          res.end(JSON.stringify({
            success: false,
            message: 'Accès refusé. Token manquant.'
          }));
          return;
        }

        const index = products.findIndex(p => p._id === adminProductMatch[1]);
        if (index === -1) {
          res.writeHead(404);
          res.end(JSON.stringify({
            success: false,
            message: 'Produit non trouvé'
          }));
          return;
        }

        const deletedProduct = products.splice(index, 1)[0];
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          message: 'Produit supprimé avec succès',
          data: deletedProduct
        }));
        return;
      }

     // Gestion des fichiers statiques
  if (req.url === '/' || req.url.includes('.html') || req.url.includes('.css') || req.url.includes('.js') || req.url.includes('.png') || req.url.includes('.jpg') || req.url.includes('.jpeg') || req.url.includes('.gif')) {
    const fs = require('fs');
    const path = require('path');
    
    // Remove query parameters from URL
    const cleanUrl = req.url.split('?')[0];
    const normalizedUrl = cleanUrl === '/' ? '/index.html' : cleanUrl;
    const filePath = path.join(__dirname, 'public', normalizedUrl);
    
    console.log('Tentative de lecture du fichier:', filePath);
    
    if (fs.existsSync(filePath)) {
      try {
        const data = fs.readFileSync(filePath);
        const ext = path.extname(filePath);
        const contentType = ext === '.html' ? 'text/html' : 
                            ext === '.css' ? 'text/css' : 
                            ext === '.js' ? 'application/javascript' : 'text/plain';
                            
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
        return;
      } catch (err) {
        console.error('Erreur de lecture:', err);
        res.writeHead(500);
        res.end(JSON.stringify({
          success: false,
          message: 'Erreur lors de la lecture du fichier'
        }));
        return;
      }
    } else {
      console.log('Fichier non trouvé:', filePath);
    }
  }

  // Route non trouvée
  res.writeHead(404);
  res.end(JSON.stringify({
    success: false,
    message: 'Route non trouvée'
  }));

  } catch (error) {
    res.writeHead(500);
    res.end(JSON.stringify({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    }));
  }
});

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║  🚀 Serveur de test démarré                       ║
║  📍 Port: ${PORT}                                  ║
║  💾 Base de données: En mémoire (test)            ║
╚════════════════════════════════════════════════════╝

📚 Points d'accès disponibles:
  • GET    /api/health                (Santé du serveur)
  • POST   /api/auth/login            (Obtenir un token JWT)
  • GET    /api/products              (Lister tous les produits)
  • GET    /api/products/:id          (Détails d'un produit)
  • POST   /api/products              (Créer un produit - Admin)
  • PUT    /api/products/:id          (Modifier un produit - Admin)
  • DELETE /api/products/:id          (Supprimer un produit - Admin)
  • GET    /api/admin/products        (Lister tous les produits - Admin)
  • GET    /api/admin/products/:id    (Détails d'un produit - Admin)
  • POST   /api/admin/products        (Créer un produit - Admin)
  • PUT    /api/admin/products/:id    (Modifier un produit - Admin)
  • DELETE /api/admin/products/:id    (Supprimer un produit - Admin)

🔐 Identifiants de test:
  Username: admin
  Password: admin123

Serveur prêt pour les tests! 🎉
  `);
});

process.on('SIGINT', () => {
  console.log('\n✋ Arrêt du serveur...');
  process.exit(0);
});
