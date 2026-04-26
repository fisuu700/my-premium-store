/**
 * Constantes de l'application
 */

// Messages de succès
const SUCCESS_MESSAGES = {
  PRODUCT_CREATED: 'Produit créé avec succès',
  PRODUCT_UPDATED: 'Produit modifié avec succès',
  PRODUCT_DELETED: 'Produit supprimé avec succès',
  AUTH_SUCCESS: 'Authentification réussie',
  ADMIN_CREATED: 'Administrateur créé avec succès'
};

// Messages d'erreur
const ERROR_MESSAGES = {
  PRODUCT_NOT_FOUND: 'Produit non trouvé',
  INVALID_CREDENTIALS: 'Identifiants invalides',
  UNAUTHORIZED: 'Non autorisé',
  TOKEN_MISSING: 'Token manquant',
  TOKEN_INVALID: 'Token invalide ou expiré',
  VALIDATION_ERROR: 'Erreur de validation',
  SERVER_ERROR: 'Erreur serveur interne',
  DUPLICATE_ENTRY: 'Cet enregistrement existe déjà',
  MONGO_CONNECTION_ERROR: 'Erreur de connexion à la base de données'
};

// Codes HTTP
const HTTP_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500
};

// Configuration JWT
const JWT_CONFIG = {
  EXPIRY: '24h',
  ALGORITHM: 'HS256'
};

module.exports = {
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  HTTP_CODES,
  JWT_CONFIG
};
