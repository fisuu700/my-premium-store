# Architecture du projet

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (Frontend)                 │
│              (Navigateur, Mobile App, etc.)          │
└──────────────────────┬──────────────────────────────┘
                       │
                    HTTP/HTTPS
                       │
┌──────────────────────▼──────────────────────────────┐
│                   EXPRESS SERVER                     │
│         (Node.js Backend API REST)                   │
│  ┌──────────────────────────────────────────────┐  │
│  │  Routes & Controllers                         │  │
│  │  - Auth Routes                                │  │
│  │  - Product Routes                             │  │
│  │  - Admin Routes                               │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │  Middlewares                                  │  │
│  │  - authMiddleware (JWT)                       │  │
│  │  - validationMiddleware                       │  │
│  │  - errorHandler                               │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │  Services                                     │  │
│  │  - facebookService                            │  │
│  │  - emailService                               │  │
│  └──────────────────────────────────────────────┘  │
└──────────┬────────────────────────┬────────────────┘
           │                        │
    ┌──────▼──────┐         ┌──────▼──────┐
    │   MongoDB   │         │  Facebook   │
    │  (Database) │         │ Graph API   │
    └─────────────┘         └─────────────┘
```

## Structure des répertoires détaillée

### `/config`
Configuration centralisée de l'application.

```
config/
├── constants.js      # Messages, codes HTTP, config JWT
├── database.js       # Gestion connexion MongoDB
└── logger.js         # Système de logging
```

**Responsabilités:**
- Variables constantes
- Configuration environnement
- Gestion de la base de données
- Logging centralisé

---

### `/models`
Schémas et modèles de données MongoDB (Mongoose).

```
models/
├── Product.js    # Schéma produit (nom, prix, stock, etc.)
└── Admin.js      # Schéma admin (authentication, roles)
```

**Responsabilités:**
- Définir la structure des données
- Validation au niveau base de données
- Pré-processing des données
- Méthodes personnalisées sur les modèles

---

### `/routes`
Définition des endpoints API.

```
routes/
├── authRoutes.js              # POST /api/auth/login
├── productRoutes.js           # CRUD produits simples
├── advancedProductRoutes.js   # Search, stats, bulk
└── adminRoutes.js             # Gestion administrateurs
```

**Responsabilités:**
- Définir les routes HTTP
- Appeler les middlewares
- Gérer les erreurs HTTP
- Formater les réponses

---

### `/middleware`
Traitements appliqués avant les contrôleurs.

```
middleware/
├── authMiddleware.js         # Vérification JWT
├── errorHandler.js           # Gestion centralisée erreurs
└── validationMiddleware.js   # Validation requêtes
```

**Responsabilités:**
- Authentification
- Validation des données
- Gestion des erreurs
- Logs de requêtes

**Ordre d'exécution:**
```
Requête → validationMiddleware → authMiddleware → Route Handler → errorHandler → Réponse
```

---

### `/services`
Logique métier isolée et réutilisable.

```
services/
├── facebookService.js    # Publication sur Facebook
└── emailService.js       # Envoi d'emails
```

**Responsabilités:**
- Logique métier complexe
- Appels API externes
- Opérations transactionnelles
- Gestion des erreurs métier

---

### `/utils`
Fonctions utilitaires et helper.

```
utils/
└── validators.js    # Validation email, produit, URL
```

**Responsabilités:**
- Fonctions réutilisables
- Validations métier
- Formatage de données
- Conversions

---

## Flux de requête typique

### Créer un produit (POST /api/products)

```
1. Client envoie requête
   POST /api/products
   Authorization: Bearer token
   Content-Type: application/json

2. Express reçoit la requête

3. Middlewares s'exécutent en séquence:
   a) validateJSON: Vérifie Content-Type
   b) authMiddleware: Vérifie le JWT
   c) validateProductData: Valide les données

4. Route handler (productRoutes.js):
   a) Crée un objet Product
   b) Appelle product.save()
   c) Appelle publishToFacebook()

5. Services:
   a) facebookService.publishToFacebook()
   b) Appelle l'API Facebook

6. Réponse:
   a) Si succès: 201 + données produit
   b) Si erreur: errorHandler capture et répond
   
7. Réponse JSON envoyée au client
```

---

## Flux d'authentification

```
1. POST /api/auth/login
   {username, password}

2. authRoutes.js:
   - Vérifie username/password vs .env
   - Génère JWT token
   - Retourne token (valide 24h)

3. Client stocke token (localStorage, session)

4. Client envoie requête protégée:
   Header: Authorization: Bearer token

5. authMiddleware:
   - Extrait token du header
   - Vérifie signature JWT
   - Décrypte le payload
   - Attache données à req.admin

6. Route handler a accès à req.admin
```

---

## Modèle de données

### Product
```
{
  _id: ObjectId,
  nom: String (required, max 100),
  description: String (required, max 1000),
  prix: Number (required, >= 0),
  imageURL: String (required),
  stock: Number (default 0, >= 0),
  categorie: String (default "Général"),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Admin
```
{
  _id: ObjectId,
  username: String (required, unique, min 3),
  email: String (required, unique, valid),
  password: String (required, hashed, min 6),
  role: Enum ["admin", "super_admin"] (default "admin"),
  isActive: Boolean (default true),
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Interactions externes

### Facebook API
- **Endpoint**: `https://graph.facebook.com/v18.0/{pageId}/feed`
- **Authentification**: Access Token
- **Déclencheur**: Création de produit
- **Statut**: Publication optionnelle (ne bloque pas)

### MongoDB Atlas
- **Protocole**: MongoDB Protocol
- **Authentification**: Connection String
- **Opérations**: CRUD produits et admins
- **Index**: ID mongoDB sur _id

---

## Gestion des erreurs

### Niveaux d'erreur

```
┌─────────────────────────────────────────┐
│  1. Validation (Niveau Route)           │
│     - Vérifie format, types, requis     │
│     → 400 Bad Request                   │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│  2. Authentification (Middleware)       │
│     - Vérifie JWT token                 │
│     → 401 Unauthorized                  │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│  3. Logique métier (Service)            │
│     - Erreurs applicatives              │
│     → 409 Conflict / 422 Unprocessable  │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│  4. Base de données (Mongoose)          │
│     - Validations, contraintes          │
│     → Propagées vers handler            │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│  5. Handler global d'erreurs            │
│     - Formatte et loggue                │
│     → Réponse JSON cohérente            │
└─────────────────────────────────────────┘
```

---

## Sécurité

### Authentification
- **JWT** avec secret fort (HS256)
- **Expiration** 24h obligatoire
- **Token** dans Authorization header
- **Validation** sur chaque route protégée

### Données sensibles
- **Mots de passe** hachés avec bcrypt (10 rounds)
- **Tokens** jamais stockés en DB
- **Variables d'env** pour secrets (.env)
- **SELECT false** sur password dans Admin model

### Validation
- **Valeurs requises** vérifiées
- **Types** validés au niveau mongoose
- **Longueur** limitée (nom: 100, desc: 1000)
- **URLs** validées format

### CORS
- **Access-Control-Allow-Origin**: * (à restreindre en prod)
- **Méthodes**: GET, POST, PUT, DELETE
- **Headers**: Content-Type, Authorization

---

## Scalabilité future

Pour monter en charge:

```
1. Caching (Redis)
   - Cache produits populaires
   - Sessions JWT

2. Queue/Jobs (Bull, RabbitMQ)
   - Publication async Facebook
   - Envoi emails en background

3. Réplication MongoDB
   - Read replicas pour recherches
   - Backups automatiques

4. Load Balancing (Nginx)
   - Distribuer charges
   - Failover automatique

5. CDN
   - Servir images depuis CDN
   - Réduire charge serveur

6. Logging/Monitoring (Winston, Datadog)
   - Logs centralisés
   - Alertes sur erreurs
```

---

## Déploiement

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour:
- Configuration production
- Heroku, Railway, AWS
- CI/CD avec GitHub Actions
- Sécurité en production
