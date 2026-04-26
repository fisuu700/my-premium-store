# Configuration du Fichier .env - Guide Complet

## 🔧 Variables à configurer

### 1️⃣ MongoDB URI

**Qu'est-ce que c'est?**
- La chaîne de connexion à votre base de données MongoDB

**Options:**

#### Option A: MongoDB Atlas (Cloud - RECOMMANDÉ)
1. Allez sur: https://www.mongodb.com/cloud/atlas
2. Créez un compte gratuit
3. Créez un cluster (Free tier)
4. Allez à **Database** > **Connect**
5. Choisissez **Drivers** > **Node.js**
6. Copiez la chaîne de connexion
7. Remplacez `<password>` et `<username>`

**Format:**
```
MONGODB_URI=mongodb+srv://votre_username:votre_password@cluster0.xxxxx.mongodb.net/online-store?retryWrites=true&w=majority
```

**Exemple:**
```
MONGODB_URI=mongodb+srv://admin:MonPassword123@cluster0.abcd1234.mongodb.net/online-store?retryWrites=true&w=majority
```

#### Option B: MongoDB Local
Si MongoDB est installé localement:
```
MONGODB_URI=mongodb://localhost:27017/online-store
```

---

### 2️⃣ JWT Secret

**Qu'est-ce que c'est?**
- Clé secrète pour signer/vérifier les tokens JWT
- Plus elle est complexe, plus c'est sécurisé

**Génération de la clé:**

Option A: Générer avec Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Option B: Utiliser un générateur en ligne
- https://www.random.org/cgi-bin/randbytes?nbytes=32&format=h

**Exemple actuel (valide pour développement):**
```
JWT_SECRET=3d1e9073740b6932e33a55d740f77ff49d37b7061f81b2fb119f2d8fffb79336
```

**⚠️ Production:**
Générez une nouvelle clé sécurisée pour la production!

---

### 3️⃣ Admin Credentials

**Qu'est-ce que c'est?**
- Identifiants pour accéder aux routes admin (créer/modifier/supprimer produits)

**Défaut (pour développement):**
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

**⚠️ Production:**
```
ADMIN_USERNAME=votre_username_unique
ADMIN_PASSWORD=votre_password_complexe_et_securise
```

**Exemple sécurisé:**
```
ADMIN_USERNAME=admin_shop
ADMIN_PASSWORD=P@ssw0rd!2024#Secure
```

---

### 4️⃣ Facebook Graph API

**Qu'est-ce que c'est?**
- Permet de publier automatiquement les produits sur votre page Facebook

**Configuration:**

#### Étape 1: Créer une App Facebook
1. Allez sur: https://developers.facebook.com/
2. Connectez-vous ou créez un compte
3. Allez à **My Apps** > **Create App**
4. Choisissez **Business**
5. Remplissez les informations et créez l'app

#### Étape 2: Obtenir le Page ID
```bash
# Utilisez cURL ou Postman pour appeler l'API
curl "https://graph.instagram.com/me/accounts?access_token=YOUR_TOKEN"
```

Cherchez `"id"` dans la réponse - c'est votre Page ID

#### Étape 3: Générer un Access Token
1. Dans votre app Facebook, allez à **Settings** > **Basic**
2. Allez à **Tools** > **Access Token Generator**
3. Sélectionnez **Page** comme type
4. Sélectionnez votre page
5. Copiez le token généré

#### Étape 4: Configurer dans .env
```
FACEBOOK_PAGE_ID=1234567890
FACEBOOK_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Note:** Si vous ne configurez pas Facebook, la fonction fonctionne en mode **simulation** (enregistre juste en console).

---

### 5️⃣ Port Serveur

**Qu'est-ce que c'est?**
- Le port sur lequel le serveur écoute

**Par défaut:**
```
PORT=5000
```

**Autres ports courants:**
- 3000 - Développement
- 8000 - Alternative
- 8080 - Alternative

---

## 📋 Configuration Rapide

### Pour le développement local:

```env
# MongoDB - Version locale (la plus rapide pour commencer)
MONGODB_URI=mongodb://localhost:27017/online-store

# JWT - Gardez la clé fournie ou générez-en une
JWT_SECRET=3d1e9073740b6932e33a55d740f77ff49d37b7061f81b2fb119f2d8fffb79336

# Admin - Identifiants de test
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Facebook - Optionnel (fonctionne en simulation si non configuré)
FACEBOOK_PAGE_ID=
FACEBOOK_TOKEN=

# Serveur
PORT=5000
NODE_ENV=development
```

### Pour la production avec MongoDB Atlas:

```env
# MongoDB - Utilisez Atlas
MONGODB_URI=mongodb+srv://your_user:your_pass@cluster.mongodb.net/online-store?retryWrites=true&w=majority

# JWT - Générez une nouvelle clé forte
JWT_SECRET=<votre_cle_generee_ici>

# Admin - Changez les identifiants par défaut!
ADMIN_USERNAME=<username_unique>
ADMIN_PASSWORD=<password_complexe>

# Facebook - Configurez si vous voulez l'intégration
FACEBOOK_PAGE_ID=<votre_page_id>
FACEBOOK_TOKEN=<votre_token>

# Serveur
PORT=5000
NODE_ENV=production
```

---

## ✅ Checklist de Configuration

- [ ] MONGODB_URI configuré et testé
- [ ] JWT_SECRET changé (production) ou laissé par défaut (développement)
- [ ] ADMIN_USERNAME et PASSWORD changés (production)
- [ ] FACEBOOK_PAGE_ID et TOKEN configurés (optionnel)
- [ ] PORT disponible sur votre système
- [ ] NODE_ENV défini à `development` ou `production`

---

## 🧪 Tester la configuration

Une fois .env configuré:

```bash
# 1. Vérifier que Node peut lire le .env
node -e "require('dotenv').config(); console.log('MongoDB:', process.env.MONGODB_URI)"

# 2. Lancer le serveur
npm start

# 3. Tester un endpoint
curl http://localhost:5000/api/health
```

---

## 🔐 Sécurité

### ⚠️ IMPORTANT - Ne jamais committer .env!

Vérifiez que `.gitignore` contient:
```
.env
.env.local
.env.*.local
```

### Variables à changer en production:

| Variable | Développement | Production |
|----------|---------------|-----------|
| MONGODB_URI | Local | Atlas (sécurisée) |
| JWT_SECRET | Fournie | Générer une clé forte |
| ADMIN_PASSWORD | admin123 | Mot de passe complexe |
| NODE_ENV | development | production |

---

## 📞 Aide supplémentaire

### Erreur: "Cannot find module 'dotenv'"
```bash
npm install dotenv
```

### Erreur: "MongoServerError: connect ECONNREFUSED"
- Vérifiez que MongoDB fonctionne (Atlas ou local)
- Vérifiez la chaîne MONGODB_URI

### Erreur: "Token invalide"
- Générez un nouveau JWT_SECRET
- Réauthentifiez-vous

---

## Fichiers de référence

- [CONFIG_EXAMPLE.md](CONFIG_EXAMPLE.md) - Guide de configuration détaillé
- [.env](.env) - Fichier de configuration actuel
- [server.js](server.js) - Utilisation des variables .env
