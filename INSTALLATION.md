# Guide d'installation complet

## Prérequis

- **Node.js** v14+ ([Télécharger](https://nodejs.org/))
- **MongoDB** local ou compte [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **npm** ou **yarn**

## Étapes d'installation

### 1. Cloner ou télécharger le projet

```bash
cd votre-dossier
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Créer un fichier `.env` à la racine du projet:

```bash
cp .env.example .env
```

Éditer le fichier `.env` avec vos paramètres:

```env
# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/online-store

# JWT
JWT_SECRET=your_very_secret_key_here_min_32_chars

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Facebook (optionnel)
FACEBOOK_PAGE_ID=your_page_id
FACEBOOK_TOKEN=your_token

# Serveur
PORT=5000
NODE_ENV=development
LOG_LEVEL=info
```

### 4. Démarrer le serveur

**Mode développement** (avec auto-reload):
```bash
npm run dev
```

**Mode production**:
```bash
npm start
```

Le serveur démarre sur `http://localhost:5000`

## Vérifier l'installation

Tester la santé du serveur:

```bash
curl http://localhost:5000/api/health
```

Réponse attendue:
```json
{
  "success": true,
  "message": "Serveur fonctionnant correctement",
  "timestamp": "2024-01-29T..."
}
```

## Configuration MongoDB

### Option 1: MongoDB Atlas (Cloud)

1. Aller sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un compte gratuit
3. Créer un cluster
4. Obtenir la chaîne de connexion
5. Remplacer `MONGODB_URI` dans `.env`

### Option 2: MongoDB Local

Installer MongoDB:
- [Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
- [macOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-macos/)
- [Linux](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

Connexion locale:
```env
MONGODB_URI=mongodb://localhost:27017/online-store
```

## Test de l'authentification

### 1. Obtenir un token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Réponse:
```json
{
  "success": true,
  "message": "Authentification réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

### 2. Utiliser le token

Remplacer `YOUR_TOKEN` avec le token reçu:

```bash
curl http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Dépannage

### Erreur: "ENOTFOUND: getaddrinfo ENOTFOUND cluster.mongodb.net"
- Vérifier la connexion internet
- Vérifier l'URI MongoDB dans `.env`
- Vérifier les credentials MongoDB

### Erreur: "Port 5000 déjà utilisé"
```bash
# Changer le port dans .env
PORT=5001
```

### Erreur: "JWT_SECRET non défini"
- S'assurer que `.env` existe
- Vérifier que `JWT_SECRET` est renseigné

## Scripts disponibles

```bash
# Démarrage avec nodemon
npm run dev

# Démarrage production
npm start

# Seeding données (si disponible)
npm run seed

# Linting (si ESLint installé)
npm run lint
```

## Prochaines étapes

1. Implémenter l'authentification Facebook réelle
2. Ajouter un système d'emails
3. Configurer une base de données de production
4. Déployer sur un serveur (Heroku, Railway, AWS, etc.)

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour le déploiement.
