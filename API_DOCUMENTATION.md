# Documentation API complète

## Base URL
```
http://localhost:5000/api
```

## Authentification

Les routes protégées nécessitent un header `Authorization`:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 1. Routes d'authentification

### POST /auth/login
Obtenir un token JWT pour accéder aux routes admin.

**Requête:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Réponse (200):**
```json
{
  "success": true,
  "message": "Authentification réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

**Erreurs:**
- `400`: Username ou password manquant
- `401`: Identifiants invalides

---

## 2. Routes produits (publiques)

### GET /products
Récupérer la liste de tous les produits.

**Paramètres de query:**
- Aucun pour la liste simple

**Réponse (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "nom": "Laptop Dell",
      "description": "Ordinateur portable haute performance",
      "prix": 899.99,
      "imageURL": "https://example.com/image.jpg",
      "stock": 10,
      "categorie": "Électronique",
      "createdAt": "2024-01-20T10:00:00Z",
      "updatedAt": "2024-01-20T10:00:00Z"
    }
  ]
}
```

---

### GET /products/:id
Récupérer un produit spécifique.

**Paramètres:**
- `id` (string): ID MongoDB du produit

**Réponse (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "nom": "Laptop Dell",
    "description": "Ordinateur portable haute performance",
    "prix": 899.99,
    "imageURL": "https://example.com/image.jpg",
    "stock": 10,
    "categorie": "Électronique",
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-20T10:00:00Z"
  }
}
```

**Erreurs:**
- `404`: Produit non trouvé

---

## 3. Routes produits (protégées par JWT)

### POST /products
Créer un nouveau produit.

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Requête:**
```json
{
  "nom": "Laptop Dell",
  "description": "Ordinateur portable haute performance",
  "prix": 899.99,
  "imageURL": "https://example.com/image.jpg",
  "stock": 10,
  "categorie": "Électronique"
}
```

**Réponse (201):**
```json
{
  "success": true,
  "message": "Produit créé avec succès",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "nom": "Laptop Dell",
    "description": "Ordinateur portable haute performance",
    "prix": 899.99,
    "imageURL": "https://example.com/image.jpg",
    "stock": 10,
    "categorie": "Électronique",
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-20T10:00:00Z"
  },
  "facebook": {
    "success": true,
    "message": "Produit publié avec succès sur Facebook"
  }
}
```

**Champs requis:**
- `nom` (string, max 100 chars)
- `description` (string, max 1000 chars)
- `prix` (number, >= 0)
- `imageURL` (string, URL valide)

**Champs optionnels:**
- `stock` (number, défaut: 0)
- `categorie` (string, défaut: "Général")

**Erreurs:**
- `400`: Validation échouée
- `401`: Token manquant ou invalide

---

### PUT /products/:id
Modifier un produit existant.

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Requête:**
```json
{
  "nom": "Laptop Dell XPS",
  "prix": 1099.99
}
```

**Réponse (200):**
```json
{
  "success": true,
  "message": "Produit modifié avec succès",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "nom": "Laptop Dell XPS",
    "description": "Ordinateur portable haute performance",
    "prix": 1099.99,
    "imageURL": "https://example.com/image.jpg",
    "stock": 10,
    "categorie": "Électronique",
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-20T12:30:00Z"
  }
}
```

**Erreurs:**
- `404`: Produit non trouvé
- `401`: Non authentifié

---

### DELETE /products/:id
Supprimer un produit.

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Réponse (200):**
```json
{
  "success": true,
  "message": "Produit supprimé avec succès",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "nom": "Laptop Dell"
  }
}
```

**Erreurs:**
- `404`: Produit non trouvé

---

## 4. Routes avancées

### GET /search
Rechercher et filtrer les produits.

**Paramètres de query:**
- `q` (string): Terme de recherche (nom ou description)
- `categorie` (string): Filtrer par catégorie
- `minPrice` (number): Prix minimum
- `maxPrice` (number): Prix maximum
- `sort` (string): Champ de tri (préfixer avec `-` pour ordre décroissant)
- `page` (number, défaut: 1): Numéro de page
- `limit` (number, défaut: 10): Résultats par page

**Exemple:**
```
GET /search?q=laptop&categorie=Électronique&minPrice=500&maxPrice=1500&sort=-prix&page=1&limit=10
```

**Réponse:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

---

### GET /stats
Obtenir des statistiques sur les produits.

**Réponse:**
```json
{
  "success": true,
  "summary": {
    "totalProducts": 50,
    "categoriesCount": 5,
    "inventoryValue": 45000.00
  },
  "byCategory": [
    {
      "_id": "Électronique",
      "count": 20,
      "avgPrice": 600.50,
      "minPrice": 99.99,
      "maxPrice": 2999.99,
      "totalStock": 500
    }
  ]
}
```

---

### GET /categories
Obtenir la liste des catégories disponibles.

**Réponse:**
```json
{
  "success": true,
  "data": ["Électronique", "Vêtements", "Livres", "Général"]
}
```

---

### POST /bulk (Protégé)
Créer plusieurs produits en une seule requête.

**Requête:**
```json
{
  "products": [
    {
      "nom": "Produit 1",
      "description": "Description 1",
      "prix": 29.99,
      "imageURL": "https://example.com/img1.jpg"
    },
    {
      "nom": "Produit 2",
      "description": "Description 2",
      "prix": 39.99,
      "imageURL": "https://example.com/img2.jpg"
    }
  ]
}
```

**Réponse (201):**
```json
{
  "success": true,
  "message": "2 produits créés avec succès",
  "data": [...]
}
```

---

### PUT /products/:id/stock (Protégé)
Mettre à jour uniquement le stock.

**Requête:**
```json
{
  "stock": 25
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Stock mis à jour",
  "data": {...}
}
```

---

## 5. Routes admin (Protégées)

### POST /admin/register
Créer un nouvel administrateur.

**Requête:**
```json
{
  "username": "john_admin",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "admin"
}
```

---

### GET /admin/me
Récupérer les informations de l'admin connecté.

---

### GET /admin/list
Lister tous les administrateurs.

---

### PUT /admin/:id
Mettre à jour un administrateur.

---

### DELETE /admin/:id
Supprimer un administrateur.

---

## 6. Routes utilitaires

### GET /health
Vérifier la santé du serveur.

**Réponse:**
```json
{
  "success": true,
  "message": "Serveur fonctionnant correctement",
  "timestamp": "2024-01-29T10:30:00Z"
}
```

---

## Codes de statut HTTP

| Code | Signification |
|------|---------------|
| 200 | OK - Succès |
| 201 | Created - Ressource créée |
| 400 | Bad Request - Données invalides |
| 401 | Unauthorized - Non authentifié |
| 403 | Forbidden - Non autorisé |
| 404 | Not Found - Ressource non trouvée |
| 409 | Conflict - Enregistrement existe déjà |
| 500 | Internal Server Error - Erreur serveur |

---

## Gestion des erreurs

Toutes les erreurs retournent un objet JSON:

```json
{
  "success": false,
  "message": "Description de l'erreur",
  "errors": ["Erreur 1", "Erreur 2"],
  "error": "Détails techniques (dev seulement)"
}
```

---

## Exemple complet avec curl

```bash
# 1. Authentification
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# 2. Créer un produit
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Mon Produit",
    "description": "Excellente qualité",
    "prix": 49.99,
    "imageURL": "https://example.com/image.jpg",
    "stock": 50
  }'

# 3. Récupérer tous les produits
curl http://localhost:5000/api/products

# 4. Rechercher
curl "http://localhost:5000/api/search?q=produit&minPrice=10&maxPrice=100"
```

---

## Authentification JWT détails

- **Durée de validité**: 24 heures
- **Algorithme**: HS256
- **Format**: `Authorization: Bearer <token>`
- **Où obtenir**: POST /auth/login

Le token expire après 24h et une nouvelle authentification est nécessaire.
