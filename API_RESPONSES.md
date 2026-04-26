# Exemples de Réponses API

## 1. Health Check

### Requête
```
GET /api/health
```

### Réponse (200 OK)
```json
{
  "success": true,
  "message": "Serveur fonctionnant correctement",
  "timestamp": "2026-01-29T10:30:45.123Z"
}
```

---

## 2. Authentification (Login)

### Requête
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### Réponse (200 OK)
```json
{
  "success": true,
  "message": "Authentification réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluIiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3NDk0NDAwMCwiZXhwIjoxNjc0OTQ0MDAwMDAwfQ.test_signature_here",
  "expiresIn": "24h"
}
```

### Réponse d'erreur (401 Unauthorized)
```json
{
  "success": false,
  "message": "Identifiants invalides"
}
```

---

## 3. Lister tous les produits

### Requête
```
GET /api/products
```

### Réponse (200 OK)
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "1",
      "nom": "Laptop Pro 15\"",
      "description": "Ordinateur portable haute performance",
      "prix": 1299.99,
      "imageURL": "https://via.placeholder.com/400x300?text=Laptop+Pro",
      "stock": 25,
      "categorie": "Électronique",
      "createdAt": "2026-01-28T10:00:00.000Z",
      "updatedAt": "2026-01-28T10:00:00.000Z"
    },
    {
      "_id": "2",
      "nom": "Smartphone XYZ",
      "description": "Téléphone mobile dernier cri",
      "prix": 899.99,
      "imageURL": "https://via.placeholder.com/400x300?text=Smartphone",
      "stock": 50,
      "categorie": "Électronique",
      "createdAt": "2026-01-28T10:00:00.000Z",
      "updatedAt": "2026-01-28T10:00:00.000Z"
    }
  ]
}
```

---

## 4. Récupérer un produit spécifique

### Requête
```
GET /api/products/1
```

### Réponse (200 OK)
```json
{
  "success": true,
  "data": {
    "_id": "1",
    "nom": "Laptop Pro 15\"",
    "description": "Ordinateur portable haute performance",
    "prix": 1299.99,
    "imageURL": "https://via.placeholder.com/400x300?text=Laptop+Pro",
    "stock": 25,
    "categorie": "Électronique",
    "createdAt": "2026-01-28T10:00:00.000Z",
    "updatedAt": "2026-01-28T10:00:00.000Z"
  }
}
```

### Réponse d'erreur (404 Not Found)
```json
{
  "success": false,
  "message": "Produit non trouvé"
}
```

---

## 5. Créer un produit (PROTÉGÉ)

### Requête
```
POST /api/products
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "nom": "Tablette 10 pouces",
  "description": "Tablette Android avec écran haute résolution",
  "prix": 399.99,
  "imageURL": "https://via.placeholder.com/400x300?text=Tablette",
  "stock": 40,
  "categorie": "Électronique"
}
```

### Réponse (201 Created)
```json
{
  "success": true,
  "message": "Produit créé avec succès",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "nom": "Tablette 10 pouces",
    "description": "Tablette Android avec écran haute résolution",
    "prix": 399.99,
    "imageURL": "https://via.placeholder.com/400x300?text=Tablette",
    "stock": 40,
    "categorie": "Électronique",
    "createdAt": "2026-01-29T10:30:45.123Z",
    "updatedAt": "2026-01-29T10:30:45.123Z"
  },
  "facebook": {
    "success": true,
    "message": "Publication simulée sur Facebook",
    "productId": "507f1f77bcf86cd799439011"
  }
}
```

### Réponse d'erreur (401 Unauthorized - Token manquant)
```json
{
  "success": false,
  "message": "Accès refusé. Token manquant."
}
```

### Réponse d'erreur (400 Bad Request - Données invalides)
```json
{
  "success": false,
  "message": "Tous les champs requis doivent être fournis (nom, description, prix, imageURL)"
}
```

---

## 6. Modifier un produit (PROTÉGÉ)

### Requête
```
PUT /api/products/507f1f77bcf86cd799439011
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "prix": 349.99,
  "stock": 35
}
```

### Réponse (200 OK)
```json
{
  "success": true,
  "message": "Produit modifié avec succès",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "nom": "Tablette 10 pouces",
    "description": "Tablette Android avec écran haute résolution",
    "prix": 349.99,
    "imageURL": "https://via.placeholder.com/400x300?text=Tablette",
    "stock": 35,
    "categorie": "Électronique",
    "createdAt": "2026-01-29T10:30:45.123Z",
    "updatedAt": "2026-01-29T10:35:00.456Z"
  }
}
```

### Réponse d'erreur (404 Not Found)
```json
{
  "success": false,
  "message": "Produit non trouvé"
}
```

---

## 7. Supprimer un produit (PROTÉGÉ)

### Requête
```
DELETE /api/products/507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Réponse (200 OK)
```json
{
  "success": true,
  "message": "Produit supprimé avec succès",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "nom": "Tablette 10 pouces",
    "description": "Tablette Android avec écran haute résolution",
    "prix": 349.99,
    "imageURL": "https://via.placeholder.com/400x300?text=Tablette",
    "stock": 35,
    "categorie": "Électronique",
    "createdAt": "2026-01-29T10:30:45.123Z",
    "updatedAt": "2026-01-29T10:35:00.456Z"
  }
}
```

### Réponse d'erreur (404 Not Found)
```json
{
  "success": false,
  "message": "Produit non trouvé"
}
```

---

## Codes de Statut HTTP Attendus

| Code | Signification | Cas d'usage |
|------|---------------|-----------|
| 200 | OK | Succès des requêtes GET, PUT, DELETE |
| 201 | Created | Succès des requêtes POST (création) |
| 400 | Bad Request | Données invalides ou manquantes |
| 401 | Unauthorized | Token manquant ou invalide |
| 404 | Not Found | Ressource introuvable |
| 500 | Server Error | Erreur serveur |

---

## Erreurs courantes et solutions

### "Token manquant"
- Assurez-vous d'avoir inclus le header `Authorization: Bearer YOUR_TOKEN`

### "Token invalide ou expiré"
- Récupérez un nouveau token avec POST /api/auth/login
- Vérifiez que le token n'est pas modifié

### "Identifiants invalides"
- Vérifiez username et password
- Utiliser les identifiants par défaut: `admin` / `admin123`

### "Tous les champs requis doivent être fournis"
- Assurez-vous d'inclure: nom, description, prix, imageURL
- stock et categorie sont optionnels
