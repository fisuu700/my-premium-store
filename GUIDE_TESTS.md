# Guide de Test des Endpoints

## 🚀 Prérequis

1. **Serveur en fonctionnement** sur `http://localhost:5000`
2. **Node.js** installé

## 📝 Étapes pour tester

### Option 1: Avec PowerShell (Automatisé)

```powershell
# Ouvrir PowerShell et exécuter le script de test
.\test-endpoints.ps1
```

Ce script testera automatiquement:
- ✅ Health check
- ✅ Authentification (login)
- ✅ Lister les produits
- ✅ Récupérer un produit
- ✅ Créer un produit (protégé)
- ✅ Modifier un produit (protégé)
- ✅ Supprimer un produit (protégé)
- ✅ Accès sans token (doit échouer)
- ✅ Accès avec token invalide (doit échouer)

### Option 2: Avec cURL (Manuel)

#### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

**Réponse attendue:**
```json
{
  "success": true,
  "message": "Serveur fonctionnant correctement",
  "timestamp": "2026-01-29T10:30:00.000Z"
}
```

#### 2. S'authentifier et obtenir un token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Réponse attendue:**
```json
{
  "success": true,
  "message": "Authentification réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

Copiez le token pour les tests suivants.

#### 3. Lister tous les produits (PUBLIC)
```bash
curl http://localhost:5000/api/products
```

#### 4. Récupérer un produit spécifique (PUBLIC)
```bash
curl http://localhost:5000/api/products/1
```

#### 5. Créer un produit (PROTÉGÉ - remplacez TOKEN)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "nom": "Nouveau Produit",
    "description": "Description du produit",
    "prix": 299.99,
    "imageURL": "https://example.com/image.jpg",
    "stock": 50,
    "categorie": "Électronique"
  }'
```

#### 6. Modifier un produit (PROTÉGÉ)
```bash
curl -X PUT http://localhost:5000/api/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "prix": 349.99,
    "stock": 30
  }'
```

#### 7. Supprimer un produit (PROTÉGÉ)
```bash
curl -X DELETE http://localhost:5000/api/products/PRODUCT_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Option 3: Avec Postman (Recommandé pour interface graphique)

1. **Ouvrir Postman**
2. **Créer une nouvelle collection** : "Boutique API"

#### Étape 1: Authentification
- **Méthode**: POST
- **URL**: http://localhost:5000/api/auth/login
- **Body** (JSON):
```json
{
  "username": "admin",
  "password": "admin123"
}
```
- Appuyez sur **Send**
- Copiez le token reçu

#### Étape 2: Configurer le token dans Postman
- **Collections** > **Boutique API** > **Edit**
- **Variables**:
  - Nom: `token`
  - Initial value: Collez le token
  - Click **Save**

#### Étape 3: Tester les endpoints
Pour chaque requête, dans l'onglet **Headers**:
- Key: `Authorization`
- Value: `Bearer {{token}}`

Puis créez des requêtes pour chaque endpoint.

## ✅ Tests de Sécurité

### Test 1: Accès sans token (doit être refusé)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"nom":"Test","description":"Test","prix":10,"imageURL":"https://test.com/img.jpg"}'
```

Réponse attendue:
```json
{
  "success": false,
  "message": "Accès refusé. Token manquant."
}
```

### Test 2: Token invalide (doit être refusé)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer INVALID_TOKEN" \
  -d '{"nom":"Test","description":"Test","prix":10,"imageURL":"https://test.com/img.jpg"}'
```

Réponse attendue:
```json
{
  "success": false,
  "message": "Token invalide ou expiré."
}
```

## 📊 Résumé des endpoints testés

| Endpoint | Méthode | Protégé | Description |
|----------|---------|---------|-------------|
| /api/health | GET | Non | Vérifier l'état du serveur |
| /api/auth/login | POST | Non | S'authentifier et obtenir un token |
| /api/products | GET | Non | Lister tous les produits |
| /api/products/:id | GET | Non | Récupérer un produit |
| /api/products | POST | Oui | Créer un produit |
| /api/products/:id | PUT | Oui | Modifier un produit |
| /api/products/:id | DELETE | Oui | Supprimer un produit |

## 🐛 Dépannage

### Erreur: "Impossible de se connecter au serveur"
- Vérifiez que le serveur fonctionne: `node test-server.js`
- Vérifiez que le port 5000 est disponible

### Erreur: "Token invalide"
- Récupérez un nouveau token avec `/api/auth/login`
- Vérifiez que le token n'est pas expiré (24h)

### Erreur: "Produit non trouvé"
- Vérifiez que l'ID du produit existe
- Utilisez `/api/products` pour lister les IDs disponibles

## 📚 Ressources

- [cURL Documentation](https://curl.se/docs/manual.html)
- [Postman Documentation](https://learning.postman.com/)
- [HTTP Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
- [JSON](https://www.json.org/)
