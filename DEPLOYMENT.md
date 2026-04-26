# Guide de Déploiement

## 🚀 Déploiement sur Heroku

### Prérequis
- Compte Heroku
- Heroku CLI installé
- Git configuré

### Étapes

1. **Créer une application Heroku**:
```bash
heroku login
heroku create ma-boutique-en-ligne
```

2. **Ajouter les variables d'environnement**:
```bash
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=votre_cle_secrete
heroku config:set ADMIN_USERNAME=admin
heroku config:set ADMIN_PASSWORD=mot_de_passe_securise
heroku config:set FACEBOOK_PAGE_ID=votre_page_id
heroku config:set FACEBOOK_TOKEN=votre_token
heroku config:set NODE_ENV=production
```

3. **Déployer l'application**:
```bash
git push heroku main
```

4. **Vérifier les logs**:
```bash
heroku logs --tail
```

## 🚀 Déploiement sur Railway

1. **Pousser sur GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/votre-username/ma-boutique.git
git push origin main
```

2. **Connecter Railway à GitHub**:
- Aller sur [Railway.app](https://railway.app)
- Créer un nouveau projet
- Connecter votre repo GitHub
- Railway détectera automatiquement que c'est une app Node.js

3. **Configurer les variables d'environnement** dans Railway

4. **Déployer** - Railway déploiera automatiquement à chaque push

## 🚀 Déploiement sur Vercel (avec serverless)

Créer un fichier `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "MONGODB_URI": "@mongodb_uri",
    "JWT_SECRET": "@jwt_secret"
  }
}
```

## 🐳 Déploiement avec Docker

### Créer un Dockerfile:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### Créer un docker-compose.yml:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/online-store
      - JWT_SECRET=your_secret
      - NODE_ENV=production
    depends_on:
      - mongodb

  mongodb:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

### Lancer avec Docker:
```bash
docker-compose up -d
```

## 🔒 Checklist de sécurité avant production

- [ ] Changez tous les identifiants par défaut
- [ ] Activez HTTPS/SSL
- [ ] Configurez CORS correctement
- [ ] Activez le rate limiting
- [ ] Validez toutes les entrées utilisateur
- [ ] Utilisez des variables d'environnement sécurisées
- [ ] Hashez les mots de passe avec bcrypt
- [ ] Activez la journalisation
- [ ] Configurez les sauvegardes MongoDB
- [ ] Implémentez une authentification robuste
- [ ] Testez l'API avec des outils de test
- [ ] Configurez les alertes de monitoring

## 📊 Monitoring et Logs

### Avec PM2 (production)

Installer PM2:
```bash
npm install -g pm2
```

Créer un fichier `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: "boutique-api",
    script: "./server.js",
    instances: "max",
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production"
    }
  }]
};
```

Lancer:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Logs
```bash
pm2 logs
pm2 monit
```

## 🔧 Optimisations de performance

1. **Compression gzip**:
```bash
npm install compression
```

Ajouter dans server.js:
```javascript
const compression = require('compression');
app.use(compression());
```

2. **Caching**:
```bash
npm install redis
```

3. **Rate limiting**:
```bash
npm install express-rate-limit
```

4. **Pagination des produits** - Ajouter à productRoutes.js

## 📝 Backup MongoDB Atlas

1. Aller sur le dashboard MongoDB Atlas
2. Cluster > Backup
3. Configurer les snapshots automatiques
4. Télécharger les sauvegardes si nécessaire

## 🔍 Commandes utiles

```bash
# Voir les logs Heroku
heroku logs --tail

# Redémarrer l'app Heroku
heroku restart

# Variables d'env Heroku
heroku config

# Exécuter une commande en remote
heroku run "node seed.js"
```
