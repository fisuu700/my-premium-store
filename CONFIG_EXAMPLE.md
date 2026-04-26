# Guide de Configuration

## 🔧 Configuration MongoDB

### Option 1: MongoDB Atlas (Cloud)

1. Allez sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un compte gratuit
3. Créez un cluster (éditeur gratuit)
4. Allez à "Database" > "Connect"
5. Copiez la chaîne de connexion
6. Remplacez `<password>` et `<username>` par vos identifiants

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/online-store?retryWrites=true&w=majority
```

### Option 2: MongoDB Local

```
mongodb://localhost:27017/online-store
```

## 🔐 Configuration JWT

Générez une clé secrète forte:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Utilisez la sortie comme `JWT_SECRET` dans `.env`

## 📱 Configuration Facebook Graph API

### Obtenir vos identifiants Facebook:

1. Allez sur [Meta Developer Console](https://developers.facebook.com)
2. Créez une app ou utilisez une existante
3. Allez à "Settings" > "Basic" pour obtenir l'App ID
4. Allez à "Tools" > "Access Token Generator" ou "Messenger" > "Settings"
5. Générez un User Access Token avec les permissions:
   - `pages_manage_posts`
   - `pages_read_user_content`

6. Trouvez votre Page ID:
   ```bash
   curl "https://graph.instagram.com/me/accounts?access_token=YOUR_TOKEN"
   ```

### Fichier `.env` complet:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/online-store?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=votre_cle_secrete_generee_ici

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Facebook Graph API
FACEBOOK_PAGE_ID=1234567890
FACEBOOK_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Server Configuration
PORT=5000
NODE_ENV=development
```

## 🚀 Démarrage du serveur

```bash
# Installation des dépendances
npm install

# Mode développement (auto-reload avec nodemon)
npm run dev

# Mode production
npm start
```

Le serveur démarre sur `http://localhost:5000`

## ✅ Vérifier la connexion MongoDB

```bash
# Une fois le serveur démarré, visitez:
curl http://localhost:5000/api/health
```

Vous devriez voir:
```json
{
  "success": true,
  "message": "Serveur fonctionnant correctement",
  "timestamp": "2026-01-28T23:00:00.000Z"
}
```

## 🔒 Sécurité en Production

Avant de déployer:

1. **Changez tous les identifiants par défaut**:
   ```env
   ADMIN_USERNAME=votre_username_unique
   ADMIN_PASSWORD=votre_password_complexe
   JWT_SECRET=une_clé_très_complexe_et_longue
   ```

2. **Hashage des mots de passe** (optionnel, mais recommandé):
   - Installez `bcryptjs`: `npm install bcryptjs`
   - Modifiez `authRoutes.js` pour hasher les mots de passe

3. **HTTPS**: Utilisez un certificat SSL/TLS

4. **CORS**: Configurez les origines autorisées dans `server.js`

5. **Rate Limiting**: Installez `express-rate-limit`

6. **Validation**: Validez les entrées utilisateur

## 📚 Ressources utiles

- [MongoDB Atlas Docs](https://docs.mongodb.com/atlas)
- [JWT.io](https://jwt.io)
- [Facebook Graph API](https://developers.facebook.com/docs/graph-api)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)
