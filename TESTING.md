# Exemple de requêtes cURL pour tester l'API

## 1. Vérifier la santé du serveur
```bash
curl http://localhost:5000/api/health
```

## 2. S'authentifier (obtenir un token JWT)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
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

## 3. Créer un produit (route protégée)
Remplacez `YOUR_TOKEN` par le token obtenu à l'étape 2:

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "nom": "Laptop Pro 15\"",
    "description": "Ordinateur portable haute performance avec processeur dernière génération",
    "prix": 1299.99,
    "imageURL": "https://example.com/laptop.jpg",
    "stock": 25,
    "categorie": "Électronique"
  }'
```

## 4. Lister tous les produits (public)
```bash
curl http://localhost:5000/api/products
```

## 5. Récupérer un produit spécifique (public)
Remplacez `PRODUCT_ID` par l'ID du produit:

```bash
curl http://localhost:5000/api/products/PRODUCT_ID
```

## 6. Modifier un produit (route protégée)
```bash
curl -X PUT http://localhost:5000/api/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "prix": 1199.99,
    "stock": 15
  }'
```

## 7. Supprimer un produit (route protégée)
```bash
curl -X DELETE http://localhost:5000/api/products/PRODUCT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 8. Tester une route admin sans token (doit échouer)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test",
    "description": "Test",
    "prix": 10,
    "imageURL": "https://test.com/image.jpg"
  }'
```
**Réponse attendue:**
```json
{
  "success": false,
  "message": "Accès refusé. Token manquant."
}
```

## 9. Tester avec un token invalide (doit échouer)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer INVALID_TOKEN" \
  -d '{
    "nom": "Test",
    "description": "Test",
    "prix": 10,
    "imageURL": "https://test.com/image.jpg"
  }'
```

## Avec Postman ou Insomnia

1. **Importer dans Postman**:
   - Créer une nouvelle collection
   - Ajouter les endpoints ci-dessus
   - Utiliser la variable d'environnement `{{token}}` après l'authentification

2. **Dans l'onglet "Tests"** (après l'authentification):
```javascript
var jsonData = pm.response.json();
pm.environment.set("token", jsonData.token);
```

Cela stockera automatiquement le token pour les requêtes suivantes!

## Notes importantes

- ⚠️ Le fichier `.env` DOIT contenir les bonnes identifiants admin
- 🔒 Remplacez `YOUR_TOKEN` par le vrai token obtenu
- 🌐 Si le serveur ne tourne pas sur localhost:5000, ajustez l'URL
- 💾 MongoDB doit être connecté et accessible
